
"use client";

import { useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { Transaction } from '@/types';
import { useAppContext } from '@/context/app-provider';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { convertToUsd, formatCurrency } from '@/lib/currency';

interface SpendingChartsProps {
    transactions: Transaction[];
}

const renderMemberTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="rounded-lg border bg-card p-2 shadow-sm text-card-foreground">
                <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {data.fullName}
                    </span>
                    <span className="font-bold">
                       {formatCurrency(payload[0].value, 'USD')}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

const renderMonthlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border bg-card p-2 shadow-sm text-card-foreground">
                <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {label}
                    </span>
                    <span className="font-bold">
                       {formatCurrency(payload[0].value, 'USD')}
                    </span>
                </div>
            </div>
        );
    }
    return null;
};


export function SpendingCharts({ transactions }: SpendingChartsProps) {
    const { members } = useAppContext();

    const spendingByMember = useMemo(() => {
        const memberSpending: { [key: string]: number } = {};

        transactions.forEach(t => {
            const amountInUsd = convertToUsd(t.amount, t.currency);
            if (!memberSpending[t.member]) {
                memberSpending[t.member] = 0;
            }
            memberSpending[t.member] += amountInUsd;
        });
        
        return members.map(member => {
            const nameParts = member.name.split(' ');
            const initials = nameParts.length > 1 
                ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
                : member.name.substring(0, 2).toUpperCase();

            return {
                name: initials,
                fullName: member.name,
                total: memberSpending[member.name] || 0,
            };
        }).filter(m => m.total > 0).sort((a, b) => b.total - a.total);
    }, [transactions, members]);

    const monthlySpending = useMemo(() => {
        const now = new Date();
        const monthlyData: { name: string, total: number }[] = [];

        for (let i = 5; i >= 0; i--) {
            const date = subMonths(now, i);
            const monthName = format(date, 'MMM');
            const monthStart = startOfMonth(date);
            const monthEnd = endOfMonth(date);

            const total = transactions
                .filter(t => {
                    const tDate = new Date(t.date);
                    return isWithinInterval(tDate, { start: monthStart, end: monthEnd });
                })
                .reduce((sum, t) => sum + convertToUsd(t.amount, t.currency), 0);
            
            monthlyData.push({ name: monthName, total });
        }
        return monthlyData;
    }, [transactions]);


  const chartColors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
        <div className="h-[300px] w-full rounded-md bg-muted/30 p-4">
            <h3 className="text-lg font-semibold mb-4">Spending by Member (USD)</h3>
            <ResponsiveContainer width="100%" height="90%">
            <BarChart data={spendingByMember} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                    tickFormatter={(value) => formatCurrency(value, 'USD').replace(/\.\d+/, '')}
                />
                <Tooltip
                    cursor={{fill: 'hsla(var(--muted))'}}
                    content={renderMemberTooltip}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {spendingByMember.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
        <div className="h-[300px] w-full rounded-md bg-muted/30 p-4">
            <h3 className="text-lg font-semibold mb-4">Monthly Spending Trend (USD)</h3>
            <ResponsiveContainer width="100%" height="90%">
            <BarChart data={monthlySpending} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                    tickFormatter={(value) => formatCurrency(value, 'USD').replace(/\.\d+/, '')}
                />
                <Tooltip
                    cursor={{fill: 'hsla(var(--muted))'}}
                    content={renderMonthlyTooltip}
                />
                <Bar dataKey="total" radius={[4, 4, 0, 0]} >
                    {monthlySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
