
"use client";

import { useState, useMemo, createContext, useContext } from 'react';
import { DayPicker, type DayProps } from 'react-day-picker';
import { useAppContext } from '@/context/app-provider';
import type { Transaction } from '@/types';
import { format, isSameDay, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import type { LucideIcon } from 'lucide-react';
import { Separator } from './ui/separator';

interface DayData {
  net: number;
  income: number;
  expense: number;
  transactions: Transaction[];
}

const euroFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
});

const TransactionsCalendarContext = createContext<{
    transactionsByDay: Map<string, DayData>
} | null>(null);

function useTransactionsCalendarContext() {
    const context = useContext(TransactionsCalendarContext);
    if (!context) {
        throw new Error("useTransactionsCalendarContext must be used within a TransactionsCalendar");
    }
    return context;
}

const CategoryIcon = ({ categoryName, className }: { categoryName: string, className?: string }) => {
    const { categories } = useAppContext();
    const category = categories.find((c) => c.name === categoryName);
    const Icon = category?.icon;
    return Icon ? <Icon className={cn("size-3", className)} /> : null;
};

function CustomDay(props: DayProps) {
    const { transactionsByDay } = useTransactionsCalendarContext();
    const dayKey = format(props.date, 'yyyy-MM-dd');
    const dayData = transactionsByDay.get(dayKey);

    if (props.displayMonth.getMonth() !== props.date.getMonth()) {
        return <div className="h-full w-full" />;
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            "relative flex h-full w-full flex-col p-1.5 text-sm",
                            "hover:bg-accent focus:bg-accent focus:outline-none"
                        )}
                    >
                        <time dateTime={props.date.toISOString()} className={cn("ml-auto text-xs", isSameDay(props.date, new Date()) && "bg-primary text-primary-foreground rounded-full size-5 flex items-center justify-center")}>
                            {format(props.date, 'd')}
                        </time>
                        {dayData && (
                            <div className="flex-grow flex flex-col justify-between items-start mt-1 overflow-hidden">
                                <div className="space-y-1 w-full">
                                    {dayData.transactions.slice(0, 2).map(txn => (
                                        <div key={txn.id} className={cn("flex items-center gap-1 text-xs font-medium w-full truncate p-0.5 rounded-sm", txn.type === 'income' ? 'text-primary' : 'text-destructive')}>
                                            <CategoryIcon categoryName={txn.category} className={cn("shrink-0", txn.type === 'income' ? 'text-primary' : 'text-destructive')} />
                                            <span className="truncate flex-1">{txn.description}</span>
                                        </div>
                                    ))}
                                    {dayData.transactions.length > 2 && (
                                        <p className="text-xs text-muted-foreground pl-1">+ {dayData.transactions.length - 2} more</p>
                                    )}
                                </div>
                                <div className="text-xs font-bold w-full text-right" >
                                    {dayData.net !== 0 && (
                                        <span className={cn(dayData.net > 0 ? "text-primary" : "text-destructive")}>
                                            {euroFormatter.format(dayData.net)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </TooltipTrigger>
                {dayData && dayData.transactions.length > 0 && (
                     <TooltipContent className="w-64 p-2 bg-card border-border text-card-foreground">
                        <div className="font-bold mb-2 text-center">{format(props.date, 'PPP')}</div>
                        <div className="space-y-2">
                            {dayData.transactions.map(txn => (
                                <div key={txn.id} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2 truncate">
                                        <CategoryIcon categoryName={txn.category} className="text-muted-foreground" />
                                        <span className="truncate">{txn.description}</span>
                                    </div>
                                    <span className={cn("font-semibold", txn.type === 'income' ? "text-primary" : "text-destructive")}>
                                        {txn.type === 'income' ? '+' : '-'}{euroFormatter.format(txn.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-2 bg-border/50" />
                        <div className="flex justify-between font-bold text-xs">
                            <span>Net</span>
                            <span className={cn(dayData.net > 0 ? "text-primary" : "text-destructive")}>
                                {euroFormatter.format(dayData.net)}
                            </span>
                        </div>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
}

export function TransactionsCalendar() {
    const { transactions } = useAppContext();
    const [month, setMonth] = useState(new Date());

    const transactionsByDay = useMemo(() => {
        const map = new Map<string, DayData>();
        transactions.forEach(t => {
            const date = parseISO(t.date);
            const dateKey = format(date, 'yyyy-MM-dd');
            const dayData = map.get(dateKey) || { net: 0, income: 0, expense: 0, transactions: [] };
            
            const amount = t.amount;
            if (t.type === 'income') {
                dayData.income += amount;
                dayData.net += amount;
            } else {
                dayData.expense += amount;
                dayData.net -= amount;
            }
            dayData.transactions.push(t);
            map.set(dateKey, dayData);
        });

        // Sort transactions within each day to show largest amounts first
        map.forEach(dayData => {
            dayData.transactions.sort((a, b) => b.amount - a.amount);
        });
        
        return map;
    }, [transactions]);
    
    const contextValue = { transactionsByDay };

    return (
        <TransactionsCalendarContext.Provider value={contextValue}>
            <Card>
                <CardContent className="p-0">
                    <style>{`
                    .rdp-table, .rdp-month { width: 100%; }
                    .rdp-head_row, .rdp-row { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); width: 100%; }
                    .rdp-cell { border-top: 1px solid hsl(var(--border)); padding: 0; }
                    .rdp-row .rdp-cell { border-left: 1px solid hsl(var(--border));}
                    .rdp-row .rdp-cell:first-child { border-left: 0; }
                    .rdp-cell { height: 140px; }
                    .rdp-day { width: 100%; height: 100%; padding: 0; border-radius: 0; }
                    .rdp-day_outside .day-content { color: hsl(var(--muted-foreground)); opacity: 0.5; }
                    .rdp-button:focus-visible:not([disabled]) { outline: 2px solid hsl(var(--ring)); outline-offset: 2px; z-index: 10; }
                    `}</style>
                    <DayPicker
                        showOutsideDays
                        fixedWeeks
                        month={month}
                        onMonthChange={setMonth}
                        components={{
                            Day: CustomDay,
                            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                            IconRight: () => <ChevronRight className="h-4 w-4" />,
                        }}
                        classNames={{
                            root: 'p-3',
                            caption: "flex justify-center items-center relative mb-4",
                            caption_label: "text-xl font-bold",
                            nav: "space-x-1",
                            nav_button: cn(
                                buttonVariants({ variant: "outline" }),
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                            ),
                            head: 'text-center text-sm text-muted-foreground font-normal',
                            head_cell: 'pb-2 font-semibold',
                            day: 'p-0',
                        }}
                    />
                </CardContent>
            </Card>
        </TransactionsCalendarContext.Provider>
    );
}
