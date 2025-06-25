
'use client';

import { useState, useMemo, createContext, useContext } from 'react';
import { DayPicker, type DayProps } from 'react-day-picker';
import { useAppContext } from '@/context/app-provider';
import type { Transaction } from '@/types';
import { format, isSameDay, parseISO } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from './ui/button';

interface DayData {
  net: number;
  incomeCount: number;
  expenseCount: number;
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

function CustomDay(props: DayProps) {
    const { transactionsByDay } = useTransactionsCalendarContext();
    const dayKey = format(props.date, 'yyyy-MM-dd');
    const dayData = transactionsByDay.get(dayKey);

    const dots = [];
    if (dayData) {
        const expenseDots = Math.min(dayData.expenseCount, 3);
        const incomeDots = Math.min(dayData.incomeCount, 3);

        for (let i = 0; i < expenseDots; i++) {
            dots.push(<div key={`exp-${i}`} className="size-1.5 rounded-full bg-destructive" />);
        }
        for (let i = 0; i < incomeDots; i++) {
            dots.push(<div key={`inc-${i}`} className="size-1.5 rounded-full bg-primary" />);
        }
    }
    
    return (
        <button
            type="button"
            className={cn(
                "relative flex h-full w-full flex-col p-2 text-sm", 
                props.displayMonth.getMonth() !== props.date.getMonth() && "text-muted-foreground/50",
                "hover:bg-accent focus:bg-accent focus:outline-none"
            )}
            disabled={props.disabled}
        >
            <time dateTime={props.date.toISOString()} className={cn("ml-auto", isSameDay(props.date, new Date()) && "bg-primary text-primary-foreground rounded-full size-6 flex items-center justify-center")}>
                {format(props.date, 'd')}
            </time>
            {dayData && (
                 <div className="flex-grow flex flex-col justify-end items-start mt-1">
                    <div className="flex gap-0.5 mb-1">{dots}</div>
                    {dayData.net !== 0 && (
                        <div
                            className={cn(
                                "text-xs font-semibold",
                                dayData.net > 0 ? "text-primary" : "text-destructive"
                            )}
                        >
                            {euroFormatter.format(dayData.net)}
                        </div>
                    )}
                 </div>
            )}
        </button>
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
            const dayData = map.get(dateKey) || { net: 0, incomeCount: 0, expenseCount: 0 };
            
            const amount = t.type === 'income' ? t.amount : -t.amount;
            dayData.net += amount;
            
            if (t.type === 'income') {
                dayData.incomeCount += 1;
            } else {
                dayData.expenseCount += 1;
            }
            map.set(dateKey, dayData);
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
                    .rdp-cell { height: 120px; }
                    .rdp-day { width: 100%; height: 100%; padding: 0; border-radius: 0; }
                    .rdp-day_outside .day-content { color: hsl(var(--muted-foreground)); opacity: 0.5; }
                    .rdp-button:focus-visible:not([disabled]) { outline: 2px solid hsl(var(--ring)); outline-offset: 2px; z-index: 10; }
                    `}</style>
                    <DayPicker
                        showOutsideDays
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
                            day_today: 'bg-accent text-accent-foreground',
                        }}
                    />
                </CardContent>
            </Card>
        </TransactionsCalendarContext.Provider>
    );
}
