
"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PageHeader } from "@/components/page-header";
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/app-provider';
import type { Budget } from '@/types';
import { RequirePermission } from '@/components/require-permission';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const addBudgetSchema = z.object({
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


type AddBudgetValues = z.infer<typeof addBudgetSchema>;

const BudgetCard = ({ budget }: { budget: Budget }) => {
    const { transactions, members } = useAppContext();

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

        if (budget.scope === 'member') {
            if (!member) return 0;
            categoryTransactions = categoryTransactions.filter(t => t.member === member.name);
        }

        return categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    }, [transactions, budget, member]);

    const progress = Math.min((spent / budget.allocated) * 100, 100);
    const remaining = budget.allocated - spent;

    return (
        <Card>
            <CardHeader className='pb-4'>
                <CardTitle className='text-lg'>{budget.name}</CardTitle>
                 {member ? (
                     <CardDescription>
                         For <Link href={`/members/${member.id}`} className="font-medium text-primary hover:underline">{member.name}</Link>
                     </CardDescription>
                ) : (
                     <CardDescription>Global budget for all members</CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="mb-2 flex justify-between items-baseline">
                    <span className="text-2xl font-bold">${spent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-sm text-muted-foreground">
                        of ${budget.allocated.toLocaleString()}
                    </span>
                </div>
                <Progress value={progress} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">{remaining >= 0 ? `$${remaining.toLocaleString()} remaining` : `$${Math.abs(remaining).toLocaleString()} over budget`}</p>
            </CardContent>
        </Card>
    );
};

export default function BudgetsPage() {
    const { budgets, addBudget, categories, members } = useAppContext();
    const [open, setOpen] = useState(false);

    const form = useForm<AddBudgetValues>({
        resolver: zodResolver(addBudgetSchema),
        defaultValues: {
            scope: 'global'
        },
    });

    const scope = form.watch('scope');

    function onSubmit(values: AddBudgetValues) {
        const submissionValues: Omit<Budget, 'id'> = { ...values };
        if (submissionValues.scope === 'global') {
            delete submissionValues.memberId;
        }
        addBudget(submissionValues);
        form.reset({ scope: 'global', name: '', category: '', allocated: 0, memberId: ''});
        setOpen(false);
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Budgets" description="Create and manage your spending budgets." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="flex justify-end gap-2 mb-4">
                    <Button asChild variant="outline">
                        <Link href="/categories">Manage Categories</Link>
                    </Button>
                    <RequirePermission permission="budgets:manage">
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button>Create Budget</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create a New Budget</DialogTitle>
                                </DialogHeader>
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
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                            className="flex items-center space-x-4"
                                                        >
                                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="global" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">Global</FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <RadioGroupItem value="member" />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">Member</FormLabel>
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
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a member" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {members.map((member) => (
                                                                    <SelectItem key={member.id} value={member.id}>
                                                                        {member.name}
                                                                    </SelectItem>
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
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {categories.filter(c => c.name !== 'Income').map((cat) => (
                                                                <SelectItem key={cat.name} value={cat.name}>
                                                                    {cat.name}
                                                                </SelectItem>
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
                                                    <FormControl>
                                                        <Input type="number" placeholder="300.00" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className='w-full'>Create</Button>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </RequirePermission>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {budgets.map(budget => (
                        <BudgetCard key={budget.id} budget={budget} />
                    ))}
                </div>
            </main>
        </div>
    )
}
