
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpendingCharts } from "@/components/spending-charts";
import type { PendingTask, Transaction } from "@/types";
import { useAppContext } from '@/context/app-provider';
import { cn } from '@/lib/utils';
import { CategorySpending } from "./category-spending";
import { ActivitySidebar } from './activity-sidebar';
import { BudgetsOverview } from './budgets-overview';
import { CreditCard, Plane, TrendingUp, ClipboardCheck, ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getMonth, getYear, subMonths, startOfMonth, format } from 'date-fns';
import { convertToUsd, formatCurrency } from '@/lib/currency';
import { Calendar } from './ui/calendar';


// Summary card for total balance and credit
const SummaryCard = () => {
    const { accounts } = useAppContext();
    
    const balance = accounts
        .filter(acc => !acc.name.toLowerCase().includes('credit'))
        .reduce((sum, acc) => sum + convertToUsd(acc.balance, acc.currency), 0);

    const creditCards = accounts
        .filter(acc => acc.name.toLowerCase().includes('credit'))
        .reduce((sum, acc) => sum + convertToUsd(acc.balance, acc.currency), 0);

    const total = balance + creditCards;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
                <CardTitle className="text-base font-semibold">Summary</CardTitle>
                <Link href="/accounts" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                    View all <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center p-4">
                <div className="space-y-3 text-sm">
                    <div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Balance:</span>
                            <span className="font-semibold text-primary">{formatCurrency(balance, 'USD')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Credit cards:</span>
                            <span className="font-semibold text-destructive">{formatCurrency(creditCards, 'USD')}</span>
                        </div>
                    </div>
                    <Separator className="my-2 bg-border/50" />
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-muted-foreground">Total:</span>
                        <span className="font-bold text-lg text-foreground">{formatCurrency(total, 'USD')}</span>
                    </div>
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
                   <p className="text-sm font-bold">{`${data.name}: ${formatCurrency(data.fullValue, 'USD')}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                <Link href="/transactions" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                    View all <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center p-4">
                 <div className="flex w-full items-center gap-4">
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
                            <span className="font-semibold text-primary">{formatCurrency(income, 'USD')}</span>
                        </div>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center text-muted-foreground">
                                <ArrowDown className="size-4 mr-2 text-destructive shrink-0" />
                                <span>Expenses</span>
                             </div>
                             <span className="font-semibold text-destructive">{formatCurrency(expenses, 'USD')}</span>
                        </div>
                         <Separator className="my-2 bg-border/50" />
                        <div className="text-right">
                            <span className="font-bold text-lg text-foreground">{formatCurrency(net, 'USD')}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function Dashboard() {
  const { transactions: allTransactions, pendingTasks, transactions } = useAppContext();
  const expenseTransactions = allTransactions.filter(t => t.type === 'expense');

  const now = new Date();
  const thisMonth = getMonth(now);
  const thisYear = getYear(now);
  const lastMonthDate = subMonths(now, 1);
  const lastMonth = getMonth(lastMonthDate);
  const lastYear = getYear(lastMonthDate);

  const thisMonthStats = transactions.reduce((acc, t) => {
      const tDate = new Date(t.date);
      if (getMonth(tDate) === thisMonth && getYear(tDate) === thisYear) {
          const amountInUsd = convertToUsd(t.amount, t.currency);
          if (t.type === 'income') acc.income += amountInUsd;
          else acc.expenses += amountInUsd;
      }
      return acc;
  }, { income: 0, expenses: 0 });

  const lastMonthStats = transactions.reduce((acc, t) => {
      const tDate = new Date(t.date);
      if (getMonth(tDate) === lastMonth && getYear(tDate) === lastYear) {
          const amountInUsd = convertToUsd(t.amount, t.currency);
          if (t.type === 'income') acc.income += amountInUsd;
          else acc.expenses += amountInUsd;
      }
      return acc;
  }, { income: 0, expenses: 0 });


  const taskLinks: { [key: string]: string } = {
    'Pending Approvals': '/approvals',
    'New Trips Registered': '/trips',
    'Unsubmitted Expenses': '/expenses',
    'Upcoming Bills & Subscriptions': '/subscriptions',
    'Pending Reimbursements': '/expenses',
  };
  
  const [calendarDate, setCalendarDate] = useState<Date>();

  useEffect(() => {
    setCalendarDate(startOfMonth(new Date()));
  }, []);
  

  return (
    <main className="flex flex-col flex-1 gap-6 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard />
        <MonthStatCard title="This Month" income={thisMonthStats.income} expenses={thisMonthStats.expenses} />
        <MonthStatCard title="Last Month" income={lastMonthStats.income} expenses={lastMonthStats.expenses} />
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
                <CardTitle className="text-base font-semibold">Calendar</CardTitle>
                <Link href="/calendar" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                    View Full <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
            <CardContent className="flex-grow p-0 w-full">
                <Calendar
                    month={calendarDate}
                    className="w-full"
                    classNames={{
                        root: "p-3 w-full",
                        month: "space-y-2 w-full",
                        caption: "hidden",
                        head_row: "flex w-full",
                        head_cell: "w-[14.28%] text-muted-foreground rounded-md text-xs font-normal text-center",
                        row: "flex w-full mt-1",
                        cell: "w-[14.28%] text-center text-sm p-0 aspect-square",
                        day: "h-full w-full p-1 font-normal aria-selected:opacity-100",
                        day_today: "bg-primary text-primary-foreground rounded-full",
                        day_outside: "text-muted-foreground opacity-50",
                        day_selected: "bg-accent text-accent-foreground rounded-md",
                    }}
                    components={{
                      Caption: () => null,
                    }}
                />
            </CardContent>
        </Card>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="bg-card lg:col-span-2 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
                <CardTitle className="text-base font-semibold">Monthly Report</CardTitle>
                <Link href="/transactions" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                    View all <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
          <CardContent className="flex-grow p-4">
            <SpendingCharts transactions={expenseTransactions} />
          </CardContent>
        </Card>

        <CategorySpending className="lg:col-span-1 h-full" />
        
        <div className="lg:col-span-1 h-full">
          <ActivitySidebar showCalendar={false} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <BudgetsOverview className="h-full" />
          <Card className="bg-card flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
              <CardTitle className="text-base font-semibold">Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 h-full">
                {pendingTasks.map((task: PendingTask) => {
                  const link = taskLinks[task.label] || '#';
                  return (
                    <Link href={link} key={task.label} className="block group">
                      <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80 flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <p className="font-semibold text-foreground/90">{task.label}</p>
                          <div className={cn("flex size-8 items-center justify-center rounded-lg text-white", task.color)}>
                            <task.icon className="size-4" />
                          </div>
                        </div>
                        <p className="mt-4 text-3xl font-bold text-foreground">{task.value}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card flex flex-col h-full">
              <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
                  <CardTitle className="text-base font-semibold">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 h-full">
                  <Link href="/expenses/new" className="block group">
                      <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80 flex flex-col justify-center">
                      <CreditCard className="size-8 text-red-500 mb-2" />
                      <h3 className="font-semibold">New Expense</h3>
                      <p className="text-sm text-muted-foreground">Quickly add a new expense.</p>
                      </div>
                  </Link>
                  <Link href="/income/new" className="block group">
                      <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80 flex flex-col justify-center">
                      <TrendingUp className="size-8 text-green-500 mb-2" />
                      <h3 className="font-semibold">New Income</h3>
                      <p className="text-sm text-muted-foreground">Record a new source of income.</p>
                      </div>
                  </Link>
                  <Link href="/trips/new" className="block group">
                      <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80 flex flex-col justify-center">
                      <Plane className="size-8 text-blue-500 mb-2" />
                      <h3 className="font-semibold">New Trip</h3>
                      <p className="text-sm text-muted-foreground">Plan and budget a new trip.</p>
                      </div>
                  </Link>
                  <Link href="/approvals/new" className="block group">
                      <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80 flex flex-col justify-center">
                      <ClipboardCheck className="size-8 text-pink-500 mb-2" />
                      <h3 className="font-semibold">New Approval</h3>
                      <p className="text-sm text-muted-foreground">Submit a new request for approval.</p>
                      </div>
                  </Link>
                  </div>
              </CardContent>
          </Card>
      </div>
    </main>
  );
}
