
"use client";

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { SpendingCharts } from "@/components/spending-charts";
import type { PendingTask, Transaction } from "@/types";
import { useAppContext } from '@/context/app-provider';
import { cn } from '@/lib/utils';
import { CategorySpending } from "./category-spending";
import { ActivitySidebar } from './activity-sidebar';
import { BudgetsOverview } from './budgets-overview';
import { CreditCard, Plane, TrendingUp, ClipboardCheck, ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Separator } from './ui/separator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getMonth, getYear, subMonths, startOfMonth, subDays, addMonths, format } from 'date-fns';
import { convertToUsd, formatCurrency } from '@/lib/currency';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import type { DateRange } from 'react-day-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


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
            <CardHeader>
                <CardTitle className="text-base font-semibold">Summary</CardTitle>
                <CardDescription>Account balances overview (in USD)</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-end space-y-3 text-sm">
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
        <Card className="flex flex-col h-full">
             <CardHeader>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                <CardDescription>Income vs. Expenses (in USD)</CardDescription>
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
  
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [highlightedRange, setHighlightedRange] = useState<DateRange | undefined>();
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    const now = new Date();
    setCalendarDate(startOfMonth(now));
    setToday(now);
  }, []);

  const years = useMemo(() => {
    if (!today) return [];
    const currentYear = getYear(today);
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }, [today]);

  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
      value: i,
      label: format(new Date(0, i), 'MMMM'),
  })), []);
  
  const handleMonthSelect = (monthIndex: string) => {
    setHighlightedRange(undefined);
    setCalendarDate(current => new Date(getYear(current!), parseInt(monthIndex), 1));
  };

  const handleYearSelect = (year: string) => {
    setHighlightedRange(undefined);
    setCalendarDate(current => new Date(parseInt(year), getMonth(current!), 1));
  };

  const handleQuickNav = (period: 'yesterday' | 'last-week' | 'today') => {
    if (!today) return;
    
    if (period === 'today') {
        const range = { from: today, to: today };
        setCalendarDate(startOfMonth(today));
        setHighlightedRange(range);
    } else if (period === 'yesterday') {
        const yesterday = subDays(today, 1);
        const range = { from: yesterday, to: yesterday };
        setCalendarDate(startOfMonth(yesterday));
        setHighlightedRange(range);
    } else if (period === 'last-week') {
        const to = today;
        const from = subDays(to, 6);
        const range = { from, to };
        setCalendarDate(startOfMonth(from));
        setHighlightedRange(range);
    }
  };


  return (
    <main className="flex flex-col flex-1 gap-6 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard />
        <MonthStatCard title="This Month" income={thisMonthStats.income} expenses={thisMonthStats.expenses} />
        <MonthStatCard title="Last Month" income={lastMonthStats.income} expenses={lastMonthStats.expenses} />
        <Card className="h-full flex flex-col">
            <header className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
                 <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => { setHighlightedRange(undefined); setCalendarDate(prev => addMonths(prev!, -1)); }}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Select
                        value={String(getMonth(calendarDate))}
                        onValueChange={handleMonthSelect}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select
                        value={String(getYear(calendarDate))}
                        onValueChange={handleYearSelect}
                    >
                        <SelectTrigger className="w-[90px]">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Button variant="outline" size="icon" onClick={() => { setHighlightedRange(undefined); setCalendarDate(prev => addMonths(prev!, 1)); }}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleQuickNav('last-week')}
                    >
                        Last 7 days
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleQuickNav('yesterday')}
                    >
                        Yesterday
                    </Button>
                    <Button variant="outline" onClick={() => handleQuickNav('today')}>
                        Today
                    </Button>
                </div>
            </header>
            <CardContent className="p-0 flex-grow">
                <Calendar
                    mode="range"
                    selected={highlightedRange}
                    month={calendarDate}
                    onMonthChange={setCalendarDate}
                    className="p-3 w-full"
                    components={{
                        Caption: () => null, // We are using a custom header
                    }}
                />
            </CardContent>
        </Card>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
        <Card className="bg-card lg:col-span-2 h-full flex flex-col">
          <CardHeader>
            <CardTitle>Monthly Report</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
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
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
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
              <CardHeader>
                  <CardTitle>Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
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
