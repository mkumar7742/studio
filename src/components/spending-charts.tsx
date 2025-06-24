"use client";

import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { monthlySpendingData } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';
import type { Transaction } from '@/types';
import { useMemo } from 'react';
import { useAppContext } from '@/context/app-provider';

const chartConfig = {
  total: {
    label: "Total Spending",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface SpendingChartsProps {
    transactions: Transaction[];
}

export function SpendingCharts({ transactions }: SpendingChartsProps) {
    const { categories } = useAppContext();
    
    const categoryColors = useMemo(() => categories.reduce((acc, category) => {
        acc[category.name] = { color: category.color, label: category.name };
        return acc;
    }, {} as ChartConfig), [categories]);

    const categorySpendingData = useMemo(() => {
        const spending = new Map<string, number>();
        transactions
            .filter(t => t.type === 'expense')
            .forEach(t => {
                const currentAmount = spending.get(t.category) || 0;
                spending.set(t.category, currentAmount + t.amount);
            });
        return Array.from(spending.entries()).map(([category, amount]) => ({ category, amount }));
    }, [transactions]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Patterns</CardTitle>
        <CardDescription>Visualizing your financial habits over time.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="category">Category</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly">
            <div className="h-[300px] w-full pt-4">
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlySpendingData}>
                  <XAxis
                    dataKey="month"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
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
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          <TabsContent value="category">
            <div className="h-[300px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            cursor={{fill: 'hsla(var(--muted))'}}
                            contentStyle={{
                                background: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                        />
                        <Pie
                            data={categorySpendingData}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                                if (percent < 0.05) return null;

                                return (
                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                                        {`${(percent * 100).toFixed(0)}%`}
                                    </text>
                                );
                            }}
                        >
                            {categorySpendingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={categoryColors[entry.category]?.color || '#000000'} />
                            ))}
                        </Pie>
                        <Legend wrapperStyle={{fontSize: "12px"}}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
