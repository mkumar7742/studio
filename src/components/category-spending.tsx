"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/context/app-provider";
import type { Category } from '@/types';
import { Progress } from '@/components/ui/progress';

const getCategoryDetails = (categories: Category[], categoryName: string) => {
    return categories.find(c => c.name === categoryName);
};

export function CategorySpending() {
    const { transactions, categories } = useAppContext();

    const spendingData = useMemo(() => {
        const expenseTransactions = transactions.filter(t => t.type === 'expense');
        if (expenseTransactions.length === 0) return [];

        const totalSpent = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

        const spendingByCategory: { [key: string]: number } = expenseTransactions.reduce((acc, transaction) => {
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

    const euroFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    });

    return (
        <Card className="bg-card">
            <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
                {spendingData.length > 0 ? (
                    spendingData.map((item) => {
                        const Icon = item.details?.icon;
                        const color = item.details?.color;
                        return (
                            <div key={item.name}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        {Icon && (
                                            <div className="flex size-8 items-center justify-center rounded-md" style={{ backgroundColor: color }}>
                                                <Icon className="size-4 text-white" />
                                            </div>
                                        )}
                                        <span className="font-medium text-sm">{item.name}</span>
                                    </div>
                                    <span className="font-semibold text-sm">{euroFormatter.format(item.amount)}</span>
                                </div>
                                <Progress value={item.percentage} color={color} className="h-2" />
                            </div>
                        )
                    })
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No spending data available.</p>
                )}
            </CardContent>
        </Card>
    );
}
