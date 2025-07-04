
'use client';

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
import { useAppContext } from '@/context/app-provider';
import { CategorySpending } from "@/components/category-spending";
import { ActivitySidebar } from '@/components/activity-sidebar';
import { CreditCard, TrendingUp, ArrowDown, ArrowUp, ArrowRight, Building, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { getMonth, getYear, subMonths, startOfMonth } from 'date-fns';
import { convertToUsd, formatCurrency } from '@/lib/currency';
import { Calendar } from "@/components/ui/calendar";
import type { Transaction, MemberProfile, Family } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// --- Family Head Dashboard Components ---

const AllTimeSummaryCard = ({ transactions }: { transactions: Transaction[] }) => {
    const { totalIncome, totalExpenses } = useMemo(() => {
        return transactions.reduce((acc, t) => {
            const amountInUsd = convertToUsd(t.amount, t.currency);
            if (t.type === 'income') {
                acc.totalIncome += amountInUsd;
            } else {
                acc.totalExpenses += amountInUsd;
            }
            return acc;
        }, { totalIncome: 0, totalExpenses: 0 });
    }, [transactions]);

    const netBalance = totalIncome - totalExpenses;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
                <CardTitle className="text-base font-semibold">All-Time Summary</CardTitle>
                <Link href="/transactions" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                    View all <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-center p-4">
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Income:</span>
                        <span className="font-semibold text-primary">{formatCurrency(totalIncome, 'USD')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Expenses:</span>
                        <span className="font-semibold text-destructive">{formatCurrency(totalExpenses, 'USD')}</span>
                    </div>
                    <Separator className="my-2 bg-border/50" />
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-muted-foreground">Net Balance:</span>
                        <span className="font-bold text-lg text-foreground">{formatCurrency(netBalance, 'USD')}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const MonthStatCard = ({ title, income, expenses }: { title: string, income: number, expenses: number }) => {
    const net = income - expenses;
    const total = income + expenses;
    
    const chartData = [
        { name: 'Expenses', value: total > 0 ? (expenses / total) * 100 : 0, color: 'hsl(var(--destructive))', fullValue: expenses },
        { name: 'Income', value: total > 0 ? (income / total) * 100 : 0, color: 'hsl(var(--primary))', fullValue: income },
    ];
    
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

const MemberSpendingCard = ({ transactions }: { transactions: Transaction[] }) => {
    const { members } = useAppContext();
    const spendingByMember = useMemo(() => {
        const memberSpending: { [key: string]: number } = {};

        transactions.forEach(t => {
            const amountInUsd = convertToUsd(t.amount, t.currency);
            if (t.type === 'expense') {
                if (!memberSpending[t.member]) {
                    memberSpending[t.member] = 0;
                }
                memberSpending[t.member] += amountInUsd;
            }
        });
        
        return members.map(member => ({
                name: member.name.split(' ')[0], // Show first name
                fullName: member.name,
                total: memberSpending[member.name] || 0,
            }))
            .filter(m => m.total > 0)
            .sort((a, b) => b.total - a.total);
    }, [transactions, members]);

    const renderMemberTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-lg border bg-card p-2 shadow-sm text-card-foreground">
                    <p className="font-bold">{data.fullName}</p>
                    <p className="text-sm">{formatCurrency(payload[0].value, 'USD')}</p>
                </div>
            );
        }
        return null;
    };

     const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

    return (
        <Card className="bg-card h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
                <CardTitle className="text-base font-semibold">Spending by Member</CardTitle>
                <Link href="/members" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                    View all <ArrowRight className="size-4" />
                </Link>
            </CardHeader>
            <CardContent className="flex-grow p-4">
                 <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={spendingByMember} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => formatCurrency(value, 'USD').replace(/\.\d+/, '')} />
                        <Tooltip cursor={{fill: 'hsla(var(--muted))'}} content={renderMemberTooltip} />
                        <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                            {spendingByMember.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

const FamilyDashboard = () => {
    const { visibleTransactions, currentUser, getMemberRole } = useAppContext();
    const [calendarDate, setCalendarDate] = useState<Date | undefined>(undefined);

    const isFamilyHead = useMemo(() => {
        if (!currentUser) return false;
        const role = getMemberRole(currentUser);
        return role?.name === 'Family Head';
    }, [currentUser, getMemberRole]);

    const expenseTransactions = visibleTransactions.filter(t => t.type === 'expense');

    const [stats, setStats] = useState({
        thisMonth: { income: 0, expenses: 0 },
        lastMonth: { income: 0, expenses: 0 }
    });

    useEffect(() => {
        const now = new Date();
        setCalendarDate(startOfMonth(now));

        const thisMonth = getMonth(now);
        const thisYear = getYear(now);
        const lastMonthDate = subMonths(now, 1);
        const lastMonth = getMonth(lastMonthDate);
        const lastYear = getYear(lastMonthDate);

        const thisMonthStats = visibleTransactions.reduce((acc, t) => {
            const tDate = new Date(t.date);
            if (getMonth(tDate) === thisMonth && getYear(tDate) === thisYear) {
                const amountInUsd = convertToUsd(t.amount, t.currency);
                if (t.type === 'income') acc.income += amountInUsd;
                else acc.expenses += amountInUsd;
            }
            return acc;
        }, { income: 0, expenses: 0 });

        const lastMonthStats = visibleTransactions.reduce((acc, t) => {
            const tDate = new Date(t.date);
            if (getMonth(tDate) === lastMonth && getYear(tDate) === lastYear) {
                const amountInUsd = convertToUsd(t.amount, t.currency);
                if (t.type === 'income') acc.income += amountInUsd;
                else acc.expenses += amountInUsd;
            }
            return acc;
        }, { income: 0, expenses: 0 });

        setStats({ thisMonth: thisMonthStats, lastMonth: lastMonthStats });
    }, [visibleTransactions]);

    return (
        <main className="flex flex-col flex-1 gap-6 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AllTimeSummaryCard transactions={visibleTransactions} />
                <MonthStatCard title="This Month" income={stats.thisMonth.income} expenses={stats.thisMonth.expenses} />
                <MonthStatCard title="Last Month" income={stats.lastMonth.income} expenses={stats.lastMonth.expenses} />
                <Card className="flex flex-col">
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
                                root: "p-3 w-full", month: "w-full", caption: "hidden", head_row: "flex w-full",
                                head_cell: "w-[14.28%] text-muted-foreground rounded-md text-xs font-normal text-center pb-1",
                                row: "flex w-full", cell: "w-[14.28%] text-center text-sm p-0 h-8",
                                day: "h-full w-full p-0.5 font-normal aria-selected:opacity-100",
                                day_today: "bg-primary text-primary-foreground rounded-full",
                                day_outside: "text-muted-foreground opacity-50",
                                day_selected: "bg-accent text-accent-foreground rounded-md",
                            }}
                            components={{ Caption: () => null }}
                        />
                    </CardContent>
                </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {isFamilyHead && <MemberSpendingCard transactions={visibleTransactions} />}
                <CategorySpending transactions={visibleTransactions} className="h-full" />
                <Card className="bg-card h-full flex flex-col">
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
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-card flex flex-col h-full">
                    <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
                        <CardTitle className="text-base font-semibold">Quick Access</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 h-full">
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
                        </div>
                    </CardContent>
                </Card>
                <div className="h-full">
                    <ActivitySidebar showCalendar={false} />
                </div>
            </div>
        </main>
    );
}

// --- System Admin Dashboard Components ---

const AdminDashboard = () => {
  const { members, families } = useAppContext();
  
  return (
    <main className="flex flex-col flex-1 gap-6 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Families</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{families.length}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{members.length}</div>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>All Families</CardTitle>
                <CardDescription>A list of all families registered in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Family Name</TableHead>
                            <TableHead>Family ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {families.map((family: Family) => (
                            <TableRow key={family.id}>
                                <TableCell>{family.name}</TableCell>
                                <TableCell className="font-mono text-xs">{family.id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>A list of all users registered in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Family ID</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member: MemberProfile) => (
                             <TableRow key={member.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member.avatar} alt={member.name} data-ai-hint={member.avatarHint} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{member.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell><Badge variant="secondary">{member.roleName}</Badge></TableCell>
                                <TableCell className="font-mono text-xs">{member.familyId || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </main>
  );
};


export default function DashboardPage() {
  const { currentUser, isLoading } = useAppContext();
  
  if (isLoading || !currentUser) {
    return (
        <main className="flex flex-col flex-1 gap-6 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
            </div>
        </main>
    );
  }
  
  return currentUser.roleName === 'System Administrator' 
    ? <AdminDashboard /> 
    : <FamilyDashboard />;
}
