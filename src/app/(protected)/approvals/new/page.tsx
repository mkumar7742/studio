
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, PenSquare, CircleDollarSign, Shapes, Info } from 'lucide-react';
import Link from 'next/link';
import { useAppContext } from '@/context/app-provider';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';

const approvalFormSchema = z.object({
    description: z.string().min(2, { message: "Description must be at least 2 characters." }),
    amount: z.coerce.number().positive({ message: "Amount must be positive." }),
    currency: z.string({ required_error: "Please select a currency." }),
    category: z.string({ required_error: "Please select a category." }),
    notes: z.string().optional(),
});

export type ApprovalFormValues = z.infer<typeof approvalFormSchema>;

export default function NewApprovalPage() {
    const { categories, addApproval } = useAppContext();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<ApprovalFormValues>({
        resolver: zodResolver(approvalFormSchema),
        defaultValues: {
            description: "",
            amount: '' as any,
            currency: "USD",
            category: "",
            notes: "",
        }
    });

    async function onSubmit(values: ApprovalFormValues) {
        await addApproval(values);
        toast({
            title: "Approval Requested",
            description: "Your request has been submitted to the Family Head for review.",
        });
        router.push('/approvals');
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="New Expense Approval" description="Request approval for a future expense." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="p-6">
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><PenSquare/> Expense Description*</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Round-trip flight to conference" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <FormField control={form.control} name="amount" render={({ field }) => ( 
                                        <FormItem className='sm:col-span-2'>
                                            <FormLabel className="flex items-center gap-2"><CircleDollarSign/> Amount*</FormLabel>
                                            <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem> 
                                    )} />
                                    <FormField control={form.control} name="currency" render={({ field }) => ( 
                                        <FormItem>
                                            <FormLabel>Currency*</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger></FormControl>
                                                <SelectContent>{SUPPORTED_CURRENCIES.map(c => (<SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>))}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem> 
                                    )} />
                                </div>
                                
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><Shapes/> Category*</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                                <SelectContent>{categories.filter(c => c.name !== 'Income').map((cat) => (<SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>))}</SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2"><Info/> Additional Notes (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Provide any extra details or justification for this expense." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href="/approvals">Cancel</Link>
                                    </Button>
                                    <Button type="submit">Submit Request</Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
