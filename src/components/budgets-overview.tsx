
"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from '@/components/ui/progress';
import { useAppContext } from "@/context/app-provider";
import { getMonth, getYear } from 'date-fns';
import { convertToUsd, formatCurrency } from '@/lib/currency';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BudgetsOverview({ className }: { className?: string }) {
    const { budgets, transactions, categories, members } = useAppContext();

    const currentMonthBudgets = useMemo(() => {
        const now = new Date();
        const currentMonth = getMonth(now);
        const currentYear = getYear(now);

        return budgets.filter(b => b.status === 'active' && b.month === currentMonth && b.year === currentYear);
    }, [budgets]);

    const budgetProgress = useMemo(() => {
        return currentMonthBudgets.map(budget => {
            const member = budget.scope === 'member' ? members.find(m => m.id === budget.memberId) : null;

            const filteredTransactions = transactions.filter(t => {
                const transactionDate = new Date(t.date);
                const isMatchingBudget = t.type === 'expense' &&
                    t.category === budget.category &&
                    getYear(transactionDate) === budget.year &&
                    getMonth(transactionDate) === budget.month;
                
                if (!isMatchingBudget) return false;

                if (budget.scope === 'global') return true;
                if (budget.scope === 'member' && member) {
                    return t.member === member.name;
                }
                return false;
            });
            
            const spent = filteredTransactions.reduce((sum, t) => sum + convertToUsd(t.amount, t.currency), 0);
            const allocatedInUsd = convertToUsd(budget.allocated, budget.currency);
            const progress = allocatedInUsd > 0 ? Math.min((spent / allocatedInUsd) * 100, 100) : 0;
            const categoryDetails = categories.find(c => c.name === budget.category);

            return {
                ...budget,
                spent,
                allocatedInUsd,
                progress,
                color: categoryDetails?.color
            };
        }).sort((a, b) => b.allocatedInUsd - a.allocatedInUsd);
    }, [currentMonthBudgets, transactions, categories, members]);


    return (
        <Card className={cn("bg-card flex flex-col", className)}>
            <CardHeader className="flex flex-row items-center justify-between p-3 space-y-0 border-b">
                <CardTitle className="text-base font-semibold">Budgets Overview</CardTitle>
                <Link href="/budgets" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                    View all <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
            <CardContent className='flex-grow space-y-4 p-4'>
                {budgetProgress.length > 0 ? (
                    budgetProgress.slice(0, 4).map(budget => (
                        <div key={budget.id}>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">{budget.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">{formatCurrency(budget.spent, 'USD')}</span> / {formatCurrency(budget.allocatedInUsd, 'USD')}
                                </span>
                            </div>
                            <Progress value={budget.progress} color={budget.color} className="h-2" />
                        </div>
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center text-center py-10">
                        <p className="text-sm text-muted-foreground">No active budgets for this month. <br /><Link href="/budgets" className="text-primary hover:underline">Create one now!</Link></p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
