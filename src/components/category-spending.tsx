
"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/app-provider";
import type { Category } from '@/types';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { convertToUsd, formatCurrency } from '@/lib/currency';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const getCategoryDetails = (categories: Category[], categoryName: string) => {
    return categories.find(c => c.name === categoryName);
};

export function CategorySpending({ className }: { className?: string }) {
    const { transactions, categories } = useAppContext();

    const spendingData = useMemo(() => {
        const expenseTransactions = transactions.filter(t => t.type === 'expense');
        if (expenseTransactions.length === 0) return [];
        
        const expenseTransactionsInUsd = expenseTransactions.map(t => ({
            ...t,
            amount: convertToUsd(t.amount, t.currency),
        }));

        const totalSpent = expenseTransactionsInUsd.reduce((sum, t) => sum + t.amount, 0);

        const spendingByCategory: { [key: string]: number } = expenseTransactionsInUsd.reduce((acc, transaction) => {
            const category = transaction.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = 0;
            }
            acc[category] += transaction.amount;
            return acc;
        }, {} as { [key: string]: number });

        return Object.entries(spendingByCategory)
            .map(([categoryName, amount]) => ({
                name: categoryName,
                amount,
                percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
                details: getCategoryDetails(categories, categoryName),
            }))
            .sort((a, b) => b.amount - a.amount);
    }, [transactions, categories]);

    return (
        <Card className={cn("bg-card flex flex-col", className)}>
            <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0 border-b">
                <CardTitle className="text-base font-semibold">Spending by Category</CardTitle>
                <Link href="/categories" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                    View all <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
            <CardContent className='flex-grow space-y-4 p-4'>
                {spendingData.length > 0 ? (
                    spendingData.map((item) => {
                        const Icon = item.details?.icon;
                        const color = item.details?.color;
                        return (
                            <div key={item.name} className="flex items-center gap-3">
                                {Icon && (
                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: color }}>
                                        <Icon className="size-4 text-white" />
                                    </div>
                                )}
                                <div className="flex-grow space-y-1">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-sm">{item.name}</span>
                                        <span className="font-semibold text-sm">{formatCurrency(item.amount, 'USD')}</span>
                                    </div>
                                    <Progress value={item.percentage} color={color} className="h-2" />
                                </div>
                            </div>
                        )
                    })
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm text-muted-foreground text-center py-4">No spending data available.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
