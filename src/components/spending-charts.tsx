"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { Transaction } from '@/types';
import { useMemo } from 'react';
import { teamSpendingData, dayToDayExpensesData } from '@/lib/data';

interface SpendingChartsProps {
    transactions: Transaction[];
}

const renderTooltip = (props: any) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-card p-2 shadow-sm text-card-foreground">
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {label}
                        </span>
                        <span className="font-bold">
                           {payload[0].value.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};


export function SpendingCharts({ transactions }: SpendingChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[300px] w-full">
            <h3 className="text-lg font-semibold mb-4">Team Spending Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamSpendingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                    tickFormatter={(value) => `${value/1000}K`}
                />
                <Tooltip
                    cursor={{fill: 'hsla(var(--muted))'}}
                    content={renderTooltip}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {teamSpendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="h-[300px] w-full">
            <h3 className="text-lg font-semibold mb-4">Day-to-Day Expenses</h3>
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dayToDayExpensesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                    tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                    cursor={{fill: 'hsla(var(--muted))'}}
                    content={renderTooltip}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} >
                    {dayToDayExpensesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
