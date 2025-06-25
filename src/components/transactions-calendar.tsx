
"use client";

import { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { DayPicker, type DayProps } from 'react-day-picker';
import { useAppContext } from '@/context/app-provider';
import type { Transaction } from '@/types';
import { format, isSameDay, parseISO, startOfMonth, getYear, getMonth, addMonths, subDays, subWeeks } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Separator } from './ui/separator';
import { DayTransactionsDialog } from './day-transactions-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';

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
    transactionsByDay: Map<string, DayData>;
    handleDayClick: (date: Date, data: DayData | undefined) => void;
    today: Date | null;
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
    return Icon ? <Icon className={cn("size-3 shrink-0", className)} /> : null;
};

function CustomDay(props: DayProps) {
    const { transactionsByDay, handleDayClick, today } = useTransactionsCalendarContext();
    const dayKey = format(props.date, 'yyyy-MM-dd');
    const dayData = transactionsByDay.get(dayKey);
    const hasTransactions = dayData && dayData.transactions.length > 0;
    const isToday = today ? isSameDay(props.date, today) : false;

    if (props.displayMonth.getMonth() !== props.date.getMonth()) {
        return <div className="h-full w-full" />;
    }

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                     <div
                        onClick={() => handleDayClick(props.date, dayData)}
                        className={cn(
                            "relative flex h-full w-full flex-col p-1.5 text-sm focus:z-10",
                            hasTransactions ? "cursor-pointer hover:bg-accent focus:bg-accent focus:outline-none" : "cursor-default"
                        )}
                    >
                        <time dateTime={props.date.toISOString()} className={cn("ml-auto text-xs", isToday && "bg-primary text-primary-foreground rounded-full size-5 flex items-center justify-center")}>
                            {format(props.date, 'd')}
                        </time>
                        {dayData && (
                            <div className="flex-grow flex flex-col justify-between items-start mt-1 overflow-hidden">
                                <div className="space-y-1 w-full">
                                    {dayData.transactions.slice(0, 2).map(txn => (
                                        <div key={txn.id} className={cn("flex items-center gap-1.5 text-xs font-medium w-full truncate p-1 rounded-sm", 
                                            txn.type === 'income' ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'
                                        )}>
                                            <CategoryIcon categoryName={txn.category} />
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
                                            {dayData.net > 0 ? '+' : ''}{euroFormatter.format(dayData.net)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </TooltipTrigger>
                {hasTransactions && (
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
                                {dayData.net > 0 ? '+' : ''}{euroFormatter.format(dayData.net)}
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
    const [month, setMonth] = useState<Date>();
    const [today, setToday] = useState<Date | null>(null);
    const [selectedDay, setSelectedDay] = useState<{ date: Date; data: DayData } | null>(null);
    
    useEffect(() => {
        const now = new Date();
        setMonth(startOfMonth(now));
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
        if (!month) return;
        setMonth(new Date(getYear(month), parseInt(monthIndex), 1));
    };

    const handleYearSelect = (year: string) => {
        if (!month) return;
        setMonth(new Date(parseInt(year), getMonth(month), 1));
    };

    const handleQuickNav = (period: 'yesterday' | 'last-week' | 'today') => {
        if (!today) return;
        
        if (period === 'today') {
            setMonth(startOfMonth(today));
        } else if (period === 'yesterday') {
            setMonth(startOfMonth(subDays(today, 1)));
        } else if (period === 'last-week') {
            setMonth(startOfMonth(subWeeks(today, 1)));
        }
    };


    const handleDayClick = (date: Date, data: DayData | undefined) => {
        if (data && data.transactions.length > 0) {
            setSelectedDay({ date, data });
        }
    };

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

        map.forEach(dayData => {
            dayData.transactions.sort((a, b) => b.amount - a.amount);
        });
        
        return map;
    }, [transactions]);
    
    const contextValue = { transactionsByDay, handleDayClick, today };

    if (!month || !today) {
        return (
            <Card>
                <CardContent className="p-3">
                    <Skeleton className="h-[960px] w-full" />
                </CardContent>
            </Card>
        );
    }
    
    return (
        <TransactionsCalendarContext.Provider value={contextValue}>
            <Card>
                <header className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setMonth(prev => addMonths(prev!, -1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Select
                            value={String(getMonth(month))}
                            onValueChange={handleMonthSelect}
                        >
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select
                            value={String(getYear(month))}
                            onValueChange={handleYearSelect}
                        >
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                            </SelectContent>
                        </Select>
                         <Button variant="outline" size="icon" onClick={() => setMonth(prev => addMonths(prev!, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => handleQuickNav('last-week')}
                        >
                            Last week
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
                <CardContent className="p-0">
                    <DayPicker
                        showOutsideDays
                        fixedWeeks
                        month={month}
                        onMonthChange={setMonth}
                        components={{
                            Day: CustomDay,
                            Caption: () => null, // We are using a custom header
                        }}
                        classNames={{
                            root: 'p-3',
                            table: 'w-full border-collapse',
                            head_row: 'flex',
                            head_cell: 'w-[14.28%] text-muted-foreground rounded-md font-normal text-[0.8rem] text-center pb-2',
                            row: 'flex w-full',
                            cell: 'h-[140px] w-[14.28%] text-sm p-0 relative border',
                            day: 'h-full w-full p-0 focus:relative focus:z-20',
                            day_today: 'bg-accent text-accent-foreground',
                            day_outside: 'day-outside text-muted-foreground opacity-50',
                        }}
                    />
                </CardContent>
            </Card>
            <DayTransactionsDialog
                day={selectedDay}
                open={!!selectedDay}
                onOpenChange={(isOpen) => !isOpen && setSelectedDay(null)}
            />
        </TransactionsCalendarContext.Provider>
    );
}
