
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const SummaryCard = () => {
    const balance = 13627.71;
    const creditCards = -249.00;
    const total = balance + creditCards;
    
    const currencyFormatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                    <span className="">Balance:</span>
                    <span className="font-semibold text-emerald-600">{currencyFormatter.format(balance)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="">Credit cards:</span>
                    <span className="font-semibold text-destructive">{currencyFormatter.format(creditCards).replace('£-', '-£')}</span>
                </div>
                <Separator className="my-2" />
                <div className="text-right">
                    <span className="font-bold text-lg">{currencyFormatter.format(total)}</span>
                </div>
            </CardContent>
        </Card>
    );
};

const MonthStatCard = ({ title, income, expenses, chartData }: { title: string, income: number, expenses: number, chartData: { name: string, value: number, color: string }[] }) => {
    const net = income - expenses;
    const currencyFormatter = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 2
    });

    return (
        <Card>
             <CardHeader>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                 <div className="w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={40}
                                dataKey="value"
                                strokeWidth={0}
                                labelLine={false}
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    return (
                                        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-[10px] font-bold">
                                            {`${(percent * 100).toFixed(1)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1 text-sm">
                    <div className="flex items-center">
                        <ArrowUp className="size-4 mr-2 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-emerald-600 ml-auto">{currencyFormatter.format(income)}</span>
                    </div>
                    <div className="flex items-center">
                         <ArrowDown className="size-4 mr-2 text-destructive shrink-0" />
                         <span className="font-semibold text-destructive ml-auto">{currencyFormatter.format(-expenses)}</span>
                    </div>
                     <Separator className="my-2 bg-border/50" />
                    <div className="text-right">
                        <span className="font-bold text-lg">{currencyFormatter.format(net)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function DashboardSummary() {
    const thisMonthChartData = [
        { name: 'Expenses', value: 28.3, color: 'hsl(var(--destructive))' },
        { name: 'Income', value: 71.7, color: 'hsl(142.1, 76.2%, 36.3%)' },
    ];

    const lastMonthChartData = [
        { name: 'Expenses', value: 20.6, color: 'hsl(var(--destructive))' },
        { name: 'Income', value: 79.4, color: 'hsl(142.1, 76.2%, 36.3%)' },
    ];
    
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SummaryCard />
            <MonthStatCard title="This month" income={1452.00} expenses={573.53} chartData={thisMonthChartData} />
            <MonthStatCard title="Last month" income={1500.00} expenses={388.76} chartData={lastMonthChartData} />
        </div>
    );
};
