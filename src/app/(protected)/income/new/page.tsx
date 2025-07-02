
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Briefcase, CalendarDays, CircleDollarSign, Shapes, User, Repeat, X, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/app-provider';
import { Switch } from '@/components/ui/switch';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';

const incomeFormSchema = z.object({
    description: z.string().min(2, { message: "Description must be at least 2 characters." }),
    merchant: z.string().min(2, { message: "Source must be at least 2 characters." }),
    date: z.date({ required_error: "A date is required." }),
    amount: z.coerce.number().positive({ message: "Amount must be positive." }),
    currency: z.string({ required_error: "Please select a currency." }),
    accountId: z.string({ required_error: "Please select an account." }).min(1, { message: "Please select an account." }),
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
    message: "Frequency is required for recurring income.",
    path: ["recurrenceFrequency"],
});

type IncomeFormValues = z.infer<typeof incomeFormSchema>;

export default function NewIncomePage() {
    const { categories, members, accounts, addTransaction, currentUser } = useAppContext();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<IncomeFormValues>({
        resolver: zodResolver(incomeFormSchema),
        defaultValues: {
            description: "",
            merchant: "",
            date: new Date(),
            amount: '' as any,
            currency: "USD",
            accountId: "",
            category: "Income",
            member: currentUser.name,
            isRecurring: false,
        }
    });

    function onSubmit(values: IncomeFormValues) {
        addTransaction({
            type: 'income',
            description: values.description,
            amount: values.amount,
            currency: values.currency,
            date: format(values.date, "yyyy-MM-dd"),
            category: values.category,
            accountId: values.accountId,
            member: values.member,
            team: 'General',
            merchant: values.merchant,
            report: 'N/A',
            status: 'Submitted',
            reimbursable: false,
            isRecurring: values.isRecurring,
            recurrenceFrequency: values.recurrenceFrequency,
        });
        toast({
            title: "Income Recorded",
            description: `Successfully recorded new income: ${values.description}`,
        });
        router.push('/income');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full bg-background text-foreground">
                <header className="flex items-center justify-between p-6 border-b border-border">
                    <h1 className="text-2xl font-bold tracking-tight">New income</h1>
                    <Link href="/income">
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
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white"><TrendingUp className="size-4" /></div><span>Description*</span></Label>
                                        <FormItem className='w-full'><FormControl><Input className="bg-card border-border" {...field} /></FormControl><FormMessage /></FormItem>
                                    </>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="merchant"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white"><Briefcase className="size-4" /></div><span>Source*</span></Label>
                                        <FormItem className='w-full'><FormControl><Input className="bg-card border-border" {...field} /></FormControl><FormMessage /></FormItem>
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

                            <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-green-500 text-white"><CircleDollarSign className="size-4" /></div><span>Total*</span></Label>
                            <div className="grid grid-cols-3 gap-4">
                                <FormField control={form.control} name="amount" render={({ field }) => (<FormItem className='col-span-2'><FormControl><Input type="number" placeholder="0.00" className="col-span-2 bg-card border-border" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="currency" render={({ field }) => (<FormItem className='col-span-1'><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-card border-border"><SelectValue placeholder="Currency" /></SelectTrigger></FormControl><SelectContent>{SUPPORTED_CURRENCIES.map(c => (<SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                            </div>

                            <FormField
                                control={form.control}
                                name="accountId"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-yellow-500 text-white"><Wallet className="size-4" /></div><span>Account*</span></Label>
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger className="bg-card border-border"><SelectValue placeholder="Select an account" /></SelectTrigger></FormControl>
                                                <SelectContent>{accounts.map((acc) => (<SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>))}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500 text-white"><Shapes className="size-4" /></div><span>Category*</span></Label>
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger className="bg-card border-border"><SelectValue placeholder="Category" /></SelectTrigger></FormControl>
                                                <SelectContent>{categories.filter(c => c.name === 'Income').map((cat) => (<SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>))}</SelectContent>
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
