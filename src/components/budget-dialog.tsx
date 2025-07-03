
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/app-provider";
import type { Budget } from "@/types";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  categoryId: z.string({ required_error: "Please select a category." }),
  amount: z.coerce.number().positive({ message: "Budget amount must be positive." }),
  period: z.enum(["monthly", "yearly"]).default("monthly"),
});

type BudgetFormValues = z.infer<typeof formSchema>;

interface BudgetDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    budget?: Budget | null;
}

export function BudgetDialog({ open, onOpenChange, budget }: BudgetDialogProps) {
    const { categories, addBudget, editBudget, budgets } = useAppContext();
    const { toast } = useToast();
    const isEditing = !!budget;

    const form = useForm<BudgetFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: budget?.categoryId || "",
            amount: budget?.amount || 0,
            period: budget?.period || "monthly",
        }
    });

    // Reset form when dialog opens for a new budget or a different budget
    React.useEffect(() => {
        form.reset({
            categoryId: budget?.categoryId || "",
            amount: budget?.amount || 0,
            period: budget?.period || "monthly",
        });
    }, [open, budget, form]);

    async function onSubmit(values: BudgetFormValues) {
        try {
            if (isEditing && budget) {
                await editBudget(budget.id, values);
                toast({ title: "Budget Updated", description: `The budget for ${budget.categoryName} has been updated.` });
            } else {
                await addBudget(values);
                toast({ title: "Budget Created", description: `A new budget has been set.` });
            }
            onOpenChange(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "An error occurred.",
                variant: "destructive",
            });
        }
    }

    const availableCategories = useMemo(() => {
        const budgetedCategoryIds = new Set(budgets.map(b => b.categoryId));
        return categories.filter(c => c.name !== 'Income' && (!budgetedCategoryIds.has(c.id) || (isEditing && budget?.categoryId === c.id)));
    }, [categories, budgets, isEditing, budget]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Edit Budget" : "Create New Budget"}</DialogTitle>
                    <DialogDescription>
                        Set a spending limit for a category.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isEditing}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableCategories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                            {availableCategories.length === 0 && (
                                                <div className="p-4 text-sm text-center text-muted-foreground">
                                                    No unbudgeted categories available.
                                                </div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {isEditing && <FormDescription>Category cannot be changed after creation.</FormDescription>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Budget Amount (USD)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="500.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            {isEditing ? "Save Changes" : "Create Budget"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
