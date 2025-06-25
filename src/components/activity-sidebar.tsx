
'use client';

import { useAppContext } from '@/context/app-provider';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ArrowDownLeft, ArrowUpRight, Plane } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction, Trip } from '@/types';
import { formatCurrency } from '@/lib/currency';
import { AIFinancialInsights } from './ai-financial-insights';

const ActivityItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-4 py-3">
        {children}
    </div>
);

const ActivityIcon = ({ icon: Icon, color }: { icon: React.ElementType, color: string }) => (
    <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-white", color)}>
        <Icon className="size-4" />
    </div>
);

const ActivityContent = ({ title, description, link }: { title: string, description: string, link?: string }) => (
    <div className="flex-grow truncate">
        {link ? (
            <Link href={link} className="font-semibold hover:underline">{title}</Link>
        ) : (
            <p className="font-semibold">{title}</p>
        )}
        <p className="text-sm text-muted-foreground truncate">{description}</p>
    </div>
);

const ActivityAmount = ({ amount, currency, type }: { amount: number, currency: string, type: 'income' | 'expense' }) => (
     <div className={cn(
        "ml-auto text-sm font-bold",
        type === 'income' ? 'text-primary' : 'text-destructive'
    )}>
        {type === 'income' ? '+' : '-'}{formatCurrency(amount, currency)}
    </div>
);

const ActivityStatus = ({ status }: { status: Trip['status']}) => {
    const getStatusClasses = (s: Trip['status']) => {
        switch (s) {
            case 'Approved': return 'bg-violet-600/20 text-violet-400 border-transparent';
            case 'Pending': return 'bg-pink-600/20 text-pink-400 border-transparent';
            case 'Not Approved': return 'bg-red-600/20 text-red-400 border-transparent';
            default: return '';
        }
    };
    return <Badge variant="outline" className={cn('text-xs', getStatusClasses(status))}>{status}</Badge>;
}


export function ActivitySidebar({ showCalendar = true }: { showCalendar?: boolean }) {
    const { transactions, trips } = useAppContext();

    const recentExpenses = transactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const recentIncome = transactions
        .filter(t => t.type === 'income')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    const recentTrips = trips
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
        
    return (
        <aside className="sticky top-6 flex flex-col gap-6">
            <AIFinancialInsights />
            {showCalendar && (
                <Card>
                    <CardContent className="p-0">
                        <Calendar
                            mode="single"
                            className="p-3"
                        />
                    </CardContent>
                </Card>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="expenses" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="expenses">Expenses</TabsTrigger>
                            <TabsTrigger value="income">Income</TabsTrigger>
                            <TabsTrigger value="trips">Trips</TabsTrigger>
                        </TabsList>
                        <ScrollArea className="h-72 w-full">
                            <TabsContent value="expenses" className="space-y-1">
                                {recentExpenses.length > 0 ? recentExpenses.map(txn => (
                                    <ActivityItem key={txn.id}>
                                        <ActivityIcon icon={ArrowDownLeft} color="bg-destructive" />
                                        <ActivityContent title={txn.description} description={txn.member} />
                                        <ActivityAmount amount={txn.amount} currency={txn.currency} type="expense" />
                                    </ActivityItem>
                                )) : <p className="text-center text-sm text-muted-foreground py-10">No recent expenses.</p>}
                            </TabsContent>
                            <TabsContent value="income" className="space-y-1">
                                 {recentIncome.length > 0 ? recentIncome.map(txn => (
                                    <ActivityItem key={txn.id}>
                                        <ActivityIcon icon={ArrowUpRight} color="bg-primary" />
                                        <ActivityContent title={txn.description} description={txn.member} />
                                        <ActivityAmount amount={txn.amount} currency={txn.currency} type="income" />
                                    </ActivityItem>
                                )) : <p className="text-center text-sm text-muted-foreground py-10">No recent income.</p>}
                            </TabsContent>
                            <TabsContent value="trips" className="space-y-1">
                                {recentTrips.length > 0 ? recentTrips.map(trip => (
                                    <ActivityItem key={trip.id}>
                                        <ActivityIcon icon={Plane} color="bg-blue-500" />
                                        <ActivityContent title={trip.location} description={trip.purpose} link={`/trips/${trip.id}`} />
                                        <ActivityStatus status={trip.status} />
                                    </ActivityItem>
                                )) : <p className="text-center text-sm text-muted-foreground py-10">No recent trips.</p>}
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </CardContent>
            </Card>
        </aside>
    );
}
