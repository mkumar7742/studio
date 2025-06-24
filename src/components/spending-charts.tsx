"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import type { Transaction } from '@/types';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-provider';
import { monthlySpendingData } from '@/lib/data';

interface SpendingChartsProps {
    transactions: Transaction[];
}

export function SpendingCharts({ transactions }: SpendingChartsProps) {
    const { categories } = useAppContext();
    
    const categorySpendingData = useMemo(() => {
        const spending = new Map<string, number>();
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const currentAmount = spending.get(t.category) || 0;
                spending.set(t.category, currentAmount + t.amount);
            });

        return Array.from(spending.entries()).map(([category, amount]) => ({
            name: category,
            total: amount,
            fill: categories.find(c => c.name === category)?.color || 'hsl(var(--primary))'
        }));
    }, [transactions, categories]);


  return (
    <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[300px] w-full">
            <h3 className="text-lg font-semibold mb-2">Team Spending Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySpendingData}>
                <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value/1000}K`}
                />
                <Tooltip
                cursor={{fill: 'hsla(var(--muted))'}}
                contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
                />
                <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="h-[300px] w-full">
            <h3 className="text-lg font-semibold mb-2">Day-to-Day Expenses</h3>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categorySpendingData}>
                <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                cursor={{fill: 'hsla(var(--muted))'}}
                contentStyle={{
                    background: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: 'var(--radius)',
                }}
                />
                <Bar dataKey="total" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
