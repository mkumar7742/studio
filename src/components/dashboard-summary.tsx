"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Centralized currency formatter
const euroFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
});

// Summary card for total balance and credit
const SummaryCard = () => {
    const balance = 13627.71;
    const creditCards = -249.00;
    const total = balance + creditCards;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Summary</CardTitle>
                <CardDescription>Account balances overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Balance:</span>
                    <span className="font-semibold text-primary">{euroFormatter.format(balance)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Credit cards:</span>
                    <span className="font-semibold text-destructive">{euroFormatter.format(creditCards)}</span>
                </div>
                <Separator className="my-2 bg-border/50" />
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-muted-foreground">Total:</span>
                    <span className="font-bold text-lg text-foreground">{euroFormatter.format(total)}</span>
                </div>
            </CardContent>
        </Card>
    );
};

// Card for monthly statistics with a pie chart
const MonthStatCard = ({ title, income, expenses }: { title: string, income: number, expenses: number }) => {
    const net = income - expenses;
    const total = income + expenses;
    
    const chartData = [
        { name: 'Expenses', value: total > 0 ? (expenses / total) * 100 : 0, color: 'hsl(var(--destructive))', fullValue: expenses },
        { name: 'Income', value: total > 0 ? (income / total) * 100 : 0, color: 'hsl(var(--primary))', fullValue: income },
    ];
    
    // Custom tooltip for the pie chart
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-lg border bg-card p-2 shadow-sm text-card-foreground">
                   <p className="text-sm font-bold">{`${data.name}: ${euroFormatter.format(data.fullValue)}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="flex flex-col">
             <CardHeader>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                <CardDescription>Income vs. Expenses</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center gap-4">
                 <div className="w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsla(var(--muted))' }} />
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={40}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                            <ArrowUp className="size-4 mr-2 text-primary shrink-0" />
                            <span>Income</span>
                        </div>
                        <span className="font-semibold text-primary">{euroFormatter.format(income)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                         <div className="flex items-center text-muted-foreground">
                            <ArrowDown className="size-4 mr-2 text-destructive shrink-0" />
                            <span>Expenses</span>
                         </div>
                         <span className="font-semibold text-destructive">{euroFormatter.format(expenses)}</span>
                    </div>
                     <Separator className="my-2 bg-border/50" />
                    <div className="text-right">
                        <span className="font-bold text-lg text-foreground">{euroFormatter.format(net)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Main component to render all summary cards
export function DashboardSummary() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SummaryCard />
            <MonthStatCard title="This Month" income={1452.00} expenses={573.53} />
            <MonthStatCard title="Last Month" income={1500.00} expenses={388.76} />
        </div>
    );
};
