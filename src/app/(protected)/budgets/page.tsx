
'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, Settings2 } from 'lucide-react';
import { useAppContext } from '@/context/app-provider';
import type { Budget, Category } from '@/types';
import { RequirePermission } from '@/components/require-permission';
import { Progress } from '@/components/ui/progress';
import { formatCurrency, convertToUsd } from '@/lib/currency';
import { startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { BudgetDialog } from '@/components/budget-dialog';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const BudgetCard = ({ budget, onEdit, onDelete }: { budget: Budget; onEdit: (budget: Budget) => void; onDelete: (budget: Budget) => void; }) => {
    const { visibleTransactions, categories } = useAppContext();
    
    const category = useMemo(() => {
        return categories.find(c => c.id === budget.categoryId);
    }, [categories, budget.categoryId]);

    const spentAmount = useMemo(() => {
        const now = new Date();
        const interval = {
            start: startOfMonth(now),
            end: endOfMonth(now),
        };
        
        return visibleTransactions
            .filter(t => t.category === budget.categoryName && isWithinInterval(parseISO(t.date), interval))
            .reduce((acc, t) => acc + convertToUsd(t.amount, t.currency), 0);
    }, [visibleTransactions, budget]);

    const remainingAmount = budget.amount - spentAmount;
    const percentage = budget.amount > 0 ? (spentAmount / budget.amount) * 100 : 0;
    const isOverBudget = remainingAmount < 0;

    const Icon = category?.icon;

    if (!category) return null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: category.color }}>
                            <Icon className="size-5 text-primary-foreground" />
                        </div>
                    )}
                    <CardTitle className="text-lg">{budget.categoryName}</CardTitle>
                </div>
                 <RequirePermission permission="budgets:manage">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(budget)}>Edit Budget</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(budget)}>
                                Delete Budget
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </RequirePermission>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-bold">{formatCurrency(spentAmount, 'USD')}</span>
                        <span className="text-muted-foreground">/ {formatCurrency(budget.amount, 'USD')}</span>
                    </div>
                    <Progress value={percentage} color={isOverBudget ? 'hsl(var(--destructive))' : category.color} className="h-2" />
                    <div className="text-sm">
                        {isOverBudget ? (
                            <p className="text-destructive font-semibold">
                                {formatCurrency(Math.abs(remainingAmount), 'USD')} over budget
                            </p>
                        ) : (
                            <p className="text-muted-foreground">
                                {formatCurrency(remainingAmount, 'USD')} remaining
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function BudgetsPage() {
    const { budgets, deleteBudget } = useAppContext();
    const [budgetToEdit, setBudgetToEdit] = useState<Budget | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

    const handleEdit = (budget: Budget) => {
        setBudgetToEdit(budget);
    };

    const handleDelete = (budget: Budget) => {
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
            <PageHeader title="Budgets" description="Set and track monthly spending limits." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Monthly Budgets</CardTitle>
                                <CardDescription>Track your spending against your goals.</CardDescription>
                            </div>
                            <RequirePermission permission="budgets:manage">
                                <Button onClick={() => setIsCreateOpen(true)}>
                                    <Plus className="mr-2 size-4" /> New Budget
                                </Button>
                            </RequirePermission>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {budgets.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {budgets.map(budget => (
                                    <BudgetCard key={budget.id} budget={budget} onEdit={handleEdit} onDelete={handleDelete} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 rounded-lg border border-dashed">
                                <h3 className="text-xl font-semibold">No Budgets Created Yet</h3>
                                <p className="text-muted-foreground mt-2">Get started by creating your first budget.</p>
                                <RequirePermission permission="budgets:manage">
                                    <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                                        <Plus className="mr-2 size-4" /> Create Budget
                                    </Button>
                                </RequirePermission>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            
            <BudgetDialog
                open={isCreateOpen || !!budgetToEdit}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setIsCreateOpen(false);
                        setBudgetToEdit(null);
                    }
                }}
                budget={budgetToEdit}
            />

            <DeleteConfirmationDialog
                open={!!budgetToDelete}
                onOpenChange={(isOpen) => !isOpen && setBudgetToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Budget"
                description={`Are you sure you want to delete the budget for "${budgetToDelete?.categoryName}"? This action cannot be undone.`}
            />
        </div>
    );
}
