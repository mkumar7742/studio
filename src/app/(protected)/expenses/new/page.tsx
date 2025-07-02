
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, PenSquare, Store, CalendarDays, CircleDollarSign, Shapes, BookText, User, Repeat, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/app-provider';
import { Switch } from '@/components/ui/switch';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, parseISO, isValid } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import React, { Suspense } from 'react';

const expenseFormSchema = z.object({
    description: z.string().min(2, { message: "Subject must be at least 2 characters." }),
    merchant: z.string().min(2, { message: "Merchant must be at least 2 characters." }),
    date: z.date({ required_error: "A date is required." }),
    amount: z.coerce.number().positive({ message: "Amount must be positive." }),
    currency: z.string({ required_error: "Please select a currency." }),
    category: z.string({ required_error: "Please select a category." }),
    member: z.string({ required_error: "Please select a member." }),
    isRecurring: z.boolean().default(false),
    recurrenceFrequency: z.enum(["weekly", "monthly", "yearly"]).optional(),
}).refine(data => {
    if (data.isRecurring) {
        return !!data.recurrenceFrequency;
    }
    return true;
}, {
    message: "Frequency is required for recurring expenses.",
    path: ["recurrenceFrequency"],
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

function NewExpenseForm() {
    const { categories, members, addTransaction, currentUser } = useAppContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const parsedDate = parseISO(searchParams.get('date') || '');
    const defaultDate = isValid(parsedDate) ? parsedDate : new Date();

    const form = useForm<ExpenseFormValues>({
        resolver: zodResolver(expenseFormSchema),
        defaultValues: {
            description: searchParams.get('description') || "",
            merchant: searchParams.get('merchant') || "",
            date: defaultDate,
            amount: Number(searchParams.get('amount')) || '' as any,
            currency: searchParams.get('currency') || "USD",
            member: currentUser.name,
            isRecurring: false,
            category: "",
        }
    });

    function onSubmit(values: ExpenseFormValues) {
        addTransaction({
            type: 'expense',
            description: values.description,
            amount: values.amount,
            currency: values.currency,
            date: format(values.date, "yyyy-MM-dd"),
            category: values.category,
            member: values.member,
            merchant: values.merchant,
            isRecurring: values.isRecurring,
            recurrenceFrequency: values.recurrenceFrequency,
        });
        toast({
            title: "Expense Created",
            description: `Successfully created new expense: ${values.description}`,
        });
        router.push('/expenses');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full bg-background text-foreground">
                <header className="flex items-center justify-between p-6 border-b border-border">
                    <h1 className="text-2xl font-bold tracking-tight">New expense</h1>
                    <Link href="/expenses">
                        <Button variant="ghost" size="icon">
                            <X className="size-5" />
                        </Button>
                    </Link>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                            
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <>
                                        <Label htmlFor="description" className="flex items-center gap-4">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white"><PenSquare className="size-4" /></div>
                                            <span>Subject*</span>
                                        </Label>
                                        <FormItem className='w-full'>
                                            <FormControl><Input id="description" className="bg-card border-border" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />
                            
                             <FormField
                                control={form.control}
                                name="merchant"
                                render={({ field }) => (
                                    <>
                                        <Label htmlFor="merchant" className="flex items-center gap-4">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white"><Store className="size-4" /></div>
                                            <span>Merchant*</span>
                                        </Label>
                                        <FormItem className='w-full'>
                                            <FormControl><Input id="merchant" className="bg-card border-border" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white"><CalendarDays className="size-4" /></div><span>Date*</span></Label>
                                        <FormItem className='w-full'>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal bg-card border-border", !field.value && "text-muted-foreground")}>
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />

                            <Label htmlFor="total" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-green-500 text-white"><CircleDollarSign className="size-4" /></div>
                                <span>Total*</span>
                            </Label>
                            <div className="grid grid-cols-3 gap-4">
                                <FormField control={form.control} name="amount" render={({ field }) => ( <FormItem className='col-span-2'><FormControl><Input type="number" placeholder="0.00" className="bg-card border-border" {...field} /></FormControl><FormMessage /></FormItem> )} />
                                <FormField control={form.control} name="currency" render={({ field }) => ( <FormItem className='col-span-1'><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-card border-border"><SelectValue placeholder="Currency" /></SelectTrigger></FormControl><SelectContent>{SUPPORTED_CURRENCIES.map(c => (<SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                            </div>
                            
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500 text-white"><Shapes className="size-4" /></div><span>Category*</span></Label>
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger className="bg-card border-border"><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                                <SelectContent>{categories.filter(c => c.name !== 'Income').map((cat) => (<SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>))}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="member"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-500 text-white"><User className="size-4" /></div><span>Member*</span></Label>
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger className="bg-card border-border"><SelectValue placeholder="Select a member" /></SelectTrigger></FormControl>
                                                <SelectContent>{members.map((m) => (<SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>))}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />

                             <FormField
                                control={form.control}
                                name="isRecurring"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white"><Repeat className="size-4" /></div><span>Recurring</span></Label>
                                        <div className="flex items-center gap-4">
                                            <FormItem>
                                                <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                            </FormItem>
                                            {field.value && (
                                                <FormField
                                                    control={form.control}
                                                    name="recurrenceFrequency"
                                                    render={({ field: freqField }) => (
                                                        <FormItem>
                                                            <Select onValueChange={freqField.onChange} defaultValue={freqField.value}>
                                                                <FormControl><SelectTrigger className="bg-card border-border w-[180px]"><SelectValue placeholder="Frequency" /></SelectTrigger></FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="weekly">Weekly</SelectItem>
                                                                    <SelectItem value="monthly">Monthly</SelectItem>
                                                                    <SelectItem value="yearly">Yearly</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </div>
                                    </>
                                )}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <label className="flex flex-col items-center justify-center w-full h-64 lg:h-full border-2 border-dashed border-border rounded-lg bg-card p-6 text-center cursor-pointer hover:bg-muted/50">
                                <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground mb-4"><BookText className="size-10"/></div>
                                <span className="text-base font-semibold">Upload a receipt</span>
                                <span className="text-sm text-muted-foreground mt-1">e.g., photo, PDF, etc.</span>
                                <Input type="file" className="hidden" />
                            </label>
                        </div>
                    </div>
                </main>
                <footer className="flex justify-end items-center py-4 px-6 border-t border-border gap-4">
                    <Button type="button" variant="outline">Save draft</Button>
                    <Button type="submit">Save</Button>
                </footer>
            </form>
        </Form>
    );
}

export default function NewExpensePage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <NewExpenseForm />
        </Suspense>
    );
}
