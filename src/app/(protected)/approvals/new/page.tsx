
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, PenSquare, CircleDollarSign, Shapes, Repeat, Briefcase, Users } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/app-provider';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const approvalFormSchema = z.object({
    category: z.enum(['Travel', 'Food', 'Software'], { required_error: "Please select a category." }),
    amount: z.coerce.number().positive({ message: "Amount must be positive." }),
    currency: z.string({ required_error: "Please select a currency." }),
    frequency: z.enum(['Once', 'Monthly', 'Bi-Monthly'], { required_error: "Please select a frequency." }),
    project: z.string().min(2, { message: "Project must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
    team: z.string().min(2, { message: "Team must be at least 2 characters." }),
});

type ApprovalFormValues = z.infer<typeof approvalFormSchema>;

export default function NewApprovalPage() {
    const { addApproval } = useAppContext();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<ApprovalFormValues>({
        resolver: zodResolver(approvalFormSchema),
        defaultValues: {
            currency: "USD",
            frequency: "Once",
        }
    });

    function onSubmit(values: ApprovalFormValues) {
        addApproval(values);
        toast({
            title: "Approval Request Submitted",
            description: `Successfully submitted request for ${values.description}`,
        });
        router.push('/approvals');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full bg-background text-foreground">
                <header className="flex items-center justify-between p-6 border-b border-border">
                    <h1 className="text-2xl font-bold tracking-tight">New Approval Request</h1>
                    <Link href="/approvals">
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
                                        <Label htmlFor="description" className="flex items-center gap-4 self-start pt-2">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white"><PenSquare className="size-4" /></div>
                                            <span>Description*</span>
                                        </Label>
                                        <FormItem className='w-full'>
                                            <FormControl><Textarea id="description" className="bg-card border-border" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />

                            <Label htmlFor="total" className="flex items-center gap-4">
                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-green-500 text-white"><CircleDollarSign className="size-4" /></div>
                                <span>Amount*</span>
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
                                                <SelectContent>
                                                    <SelectItem value="Travel">Travel</SelectItem>
                                                    <SelectItem value="Food">Food</SelectItem>
                                                    <SelectItem value="Software">Software</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="frequency"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white"><Repeat className="size-4" /></div><span>Frequency*</span></Label>
                                        <FormItem className='w-full'>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger className="bg-card border-border"><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Once">Once</SelectItem>
                                                    <SelectItem value="Monthly">Monthly</SelectItem>
                                                    <SelectItem value="Bi-Monthly">Bi-Monthly</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="project"
                                render={({ field }) => (
                                    <>
                                        <Label htmlFor="project" className="flex items-center gap-4">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white"><Briefcase className="size-4" /></div>
                                            <span>Project*</span>
                                        </Label>
                                        <FormItem className='w-full'>
                                            <FormControl><Input id="project" className="bg-card border-border" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="team"
                                render={({ field }) => (
                                    <>
                                        <Label htmlFor="team" className="flex items-center gap-4">
                                            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-teal-500 text-white"><Users className="size-4" /></div>
                                            <span>Team*</span>
                                        </Label>
                                        <FormItem className='w-full'>
                                            <FormControl><Input id="team" className="bg-card border-border" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </>
                                )}
                            />

                        </div>

                        <div className="lg:col-span-1">
                             <div className="sticky top-6 p-6 rounded-lg bg-card border border-border">
                                <h3 className="font-semibold mb-4">Request Summary</h3>
                                <p className="text-sm text-muted-foreground">
                                    Please review the details before submitting. Once submitted, your request will be sent to an administrator or manager for approval. You can track the status on the approvals page.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
                <footer className="flex justify-end items-center py-4 px-6 border-t border-border gap-4">
                    <Button type="submit">Submit Request</Button>
                </footer>
            </form>
        </Form>
    );
}
