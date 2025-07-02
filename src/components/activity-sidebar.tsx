
'use client';

import { useAppContext } from '@/context/app-provider';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDownLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/types';
import { formatCurrency } from '@/lib/currency';

const ActivityItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-4 py-3 pr-4">
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


const ActivityList = ({ items, type }: { items: Transaction[], type: 'expense' | 'income' }) => {
    if (items.length === 0) {
      const typeName = `${type}s`;
      return <p className="text-center text-sm text-muted-foreground py-10">No recent {typeName}.</p>;
    }
    return (
      <div>
        {items.map(item => {
            const txn = item;
            return (
              <ActivityItem key={txn.id}>
                <ActivityIcon icon={type === 'income' ? ArrowUpRight : ArrowDownLeft} color={type === 'income' ? "bg-primary" : "bg-destructive"} />
                <ActivityContent title={txn.description} description={txn.member} />
                <ActivityAmount amount={txn.amount} currency={txn.currency} type={type} />
              </ActivityItem>
            )
        })}
      </div>
    );
  }

export function ActivitySidebar({ showCalendar = true, transactions: transactionsProp }: { showCalendar?: boolean, transactions?: Transaction[] }) {
    const { transactions: contextTransactions } = useAppContext();
    const transactions = transactionsProp ?? contextTransactions;

    const recentExpenses = transactions
        .filter(t => t.type === 'expense')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7);

    const recentIncome = transactions
        .filter(t => t.type === 'income')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 7);

    return (
        <aside className={cn("flex flex-col gap-6", showCalendar ? "sticky top-6" : "h-full")}>
            {showCalendar && (
                <Card className="h-full flex flex-col">
                    <CardContent className="p-0 flex-grow">
                        <Calendar
                            mode="single"
                            className="p-3 w-full"
                        />
                    </CardContent>
                </Card>
            )}
            <Card className={cn(!showCalendar && "h-full flex flex-col")}>
                <CardHeader className="flex flex-row items-center justify-between px-3 py-2 space-y-0 border-b">
                    <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                    <Link href="/transactions" className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary">
                        View all <ArrowRight className="size-4" />
                    </Link>
                </CardHeader>
                <CardContent className={cn("p-4 flex-grow min-h-0", !showCalendar && "flex flex-col")}>
                    <Tabs defaultValue="expenses" className="w-full flex flex-col h-full">
                        <TabsList className="grid w-full grid-cols-2 shrink-0">
                            <TabsTrigger value="expenses">Expenses</TabsTrigger>
                            <TabsTrigger value="income">Income</TabsTrigger>
                        </TabsList>
                        <TabsContent value="expenses" className="flex-grow mt-2 relative">
                            <div className="absolute inset-0 overflow-y-auto pr-2">
                                <ActivityList items={recentExpenses} type="expense" />
                            </div>
                        </TabsContent>
                        <TabsContent value="income" className="flex-grow mt-2 relative">
                             <div className="absolute inset-0 overflow-y-auto pr-2">
                                <ActivityList items={recentIncome} type="income" />
                             </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </aside>
    );
}
