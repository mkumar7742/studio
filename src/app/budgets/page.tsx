
"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from "@/components/page-header";
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/app-provider';
import type { Budget, Category } from '@/types';
import { RequirePermission } from '@/components/require-permission';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';

const budgetFormSchema = z.object({
  name: z.string().min(3, { message: "Budget name must be at least 3 characters." }),
  category: z.string({ required_error: "Please select a category." }),
  allocated: z.coerce.number().positive({ message: "Allocated amount must be positive." }),
  scope: z.enum(['global', 'member'], { required_error: "Please select a scope." }),
  memberId: z.string().optional(),
}).refine(data => {
    if (data.scope === 'member') {
        return !!data.memberId;
    }
    return true;
}, {
    message: "A member must be selected for member-specific budgets.",
    path: ["memberId"],
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

// Budget Form Component
interface BudgetFormProps {
    onFinished: () => void;
    budget?: Budget | null;
}

function BudgetForm({ onFinished, budget }: BudgetFormProps) {
    const { addBudget, editBudget, categories, members } = useAppContext();
    const isEditing = !!budget;

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(budgetFormSchema),
        defaultValues: {
            name: budget?.name || "",
            category: budget?.category || "",
            allocated: budget?.allocated || 0,
            scope: budget?.scope || 'global',
            memberId: budget?.memberId || "",
        }
    });

    const scope = form.watch('scope');

    function onSubmit(values: BudgetFormValues) {
        if (isEditing && budget) {
            editBudget(budget.id, values);
        } else {
            addBudget(values);
        }
        onFinished();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Budget Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Monthly Marketing" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="scope"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Scope</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        if (value === 'global') {
                                            form.setValue('memberId', undefined);
                                        }
                                    }}
                                    defaultValue={field.value}
                                    className="flex items-center space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="global" /></FormControl>
                                        <FormLabel className="font-normal">Global</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="member" /></FormControl>
                                        <FormLabel className="font-normal">Member-specific</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {scope === 'member' && (
                    <FormField
                        control={form.control}
                        name="memberId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Member</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a member" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {members.map((member) => (
                                            <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {categories.filter(c => c.name !== 'Income').map((cat) => (
                                        <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="allocated"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allocated Amount</FormLabel>
                            <FormControl><Input type="number" placeholder="300.00" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className='w-full'>{isEditing ? "Save Changes" : "Create Budget"}</Button>
            </form>
        </Form>
    );
}

// Budget Dialog Component
interface BudgetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    budget?: Budget | null;
}
function BudgetDialog({ open, onOpenChange, budget }: BudgetDialogProps) {
    const isEditing = !!budget;
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Budget" : "Create a New Budget"}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? "Update the details for this budget." : "Fill in the details to create a new spending budget."}
                    </DialogDescription>
                </DialogHeader>
                <BudgetForm onFinished={() => onOpenChange(false)} budget={budget} />
            </DialogContent>
        </Dialog>
    );
}

// Budget Card Component
const BudgetCard = ({ budget, onEdit, onDelete }: { budget: Budget, onEdit: () => void, onDelete: () => void }) => {
    const { transactions, members, categories } = useAppContext();

    const categoryDetails = useMemo(() => {
        return categories.find(c => c.name === budget.category);
    }, [categories, budget.category]);

    const member = useMemo(() => {
        if (budget.scope === 'member') {
            return members.find(m => m.id === budget.memberId);
        }
        return null;
    }, [members, budget]);

    const spent = useMemo(() => {
        let categoryTransactions = transactions.filter(
            (t) => t.type === 'expense' && t.category === budget.category
        );

        if (budget.scope === 'member' && member) {
            categoryTransactions = categoryTransactions.filter(t => t.member === member.name);
        }

        return categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    }, [transactions, budget, member]);

    const progress = Math.min((spent / budget.allocated) * 100, 100);
    const remaining = budget.allocated - spent;
    const Icon = categoryDetails?.icon;

    return (
        <Card className="flex flex-col">
            <CardHeader className='pb-4'>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        {Icon && (
                            <div className="flex size-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${categoryDetails?.color}20` }}>
                                <Icon className="size-5" style={{ color: categoryDetails?.color }} />
                            </div>
                        )}
                        <div>
                            <CardTitle className='text-lg'>{budget.name}</CardTitle>
                            {member ? (
                                <CardDescription>
                                    For <Link href={`/members/${member.id}`} className="font-medium text-primary hover:underline">{member.name}</Link>
                                </CardDescription>
                            ) : (
                                <CardDescription>Global budget for all members</CardDescription>
                            )}
                        </div>
                    </div>
                     <RequirePermission permission="budgets:manage">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEdit}><Pencil className="mr-2 size-4" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive"><Trash2 className="mr-2 size-4" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </RequirePermission>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end">
                <div className="mb-2 flex justify-between items-baseline">
                    <span className="text-2xl font-bold">${spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-sm text-muted-foreground">
                        of ${budget.allocated.toLocaleString()}
                    </span>
                </div>
                <Progress value={progress} color={categoryDetails?.color} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">{remaining >= 0 ? `$${remaining.toLocaleString()} remaining` : `$${Math.abs(remaining).toLocaleString()} over budget`}</p>
            </CardContent>
        </Card>
    );
};

// Main Budgets Page
export default function BudgetsPage() {
    const { budgets, deleteBudget } = useAppContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

    const handleCreateClick = () => {
        setBudgetToEdit(null);
        setIsDialogOpen(true);
    };

    const handleEditClick = (budget: Budget) => {
        setBudgetToEdit(budget);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (budget: Budget) => {
        setBudgetToDelete(budget);
    };
    
    const handleConfirmDelete = () => {
        if (budgetToDelete) {
            deleteBudget(budgetToDelete.id);
            setBudgetToDelete(null);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Budgets" description="Create and manage your spending budgets." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="flex justify-end gap-2 mb-4">
                    <Button asChild variant="outline">
                        <Link href="/categories">Manage Categories</Link>
                    </Button>
                    <RequirePermission permission="budgets:manage">
                        <Button onClick={handleCreateClick}><Plus className="mr-2 size-4" /> Create Budget</Button>
                    </RequirePermission>
                </div>
                {budgets.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {budgets.map(budget => (
                            <BudgetCard 
                                key={budget.id} 
                                budget={budget} 
                                onEdit={() => handleEditClick(budget)}
                                onDelete={() => handleDeleteClick(budget)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-border py-24">
                        <h3 className="text-2xl font-semibold tracking-tight">No Budgets Found</h3>
                        <p className="text-muted-foreground mt-2">Get started by creating a new budget.</p>
                        <RequirePermission permission="budgets:manage">
                            <Button onClick={handleCreateClick} className="mt-4"><Plus className="mr-2 size-4" /> Create Budget</Button>
                        </RequirePermission>
                    </div>
                )}
            </main>
            <BudgetDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                budget={budgetToEdit}
            />
            <DeleteConfirmationDialog 
                open={!!budgetToDelete}
                onOpenChange={(isOpen) => !isOpen && setBudgetToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Budget"
                description={`Are you sure you want to delete the "${budgetToDelete?.name}" budget? This action cannot be undone.`}
            />
        </div>
    )
}
