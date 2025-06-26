
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAppContext } from '@/context/app-provider';
import type { Trip } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from './ui/textarea';

const tripFormSchema = z.object({
  location: z.string().min(2, { message: "Location is required." }),
  purpose: z.string().min(3, { message: "Purpose is required." }),
  amount: z.coerce.number().positive(),
  currency: z.string(),
  status: z.enum(['Approved', 'Pending', 'Not Approved']),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

interface TripDialogProps {
    trip: Trip | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TripDialog({ trip, open, onOpenChange }: TripDialogProps) {
    const { editTrip } = useAppContext();
    const { toast } = useToast();

    const form = useForm<TripFormValues>({
        resolver: zodResolver(tripFormSchema),
    });

    useEffect(() => {
        if (trip) {
            form.reset({
                location: trip.location,
                purpose: trip.purpose,
                amount: trip.amount,
                currency: trip.currency,
                status: trip.status,
            });
        }
    }, [trip, form]);
    
    if (!trip) return null;

    function onSubmit(values: TripFormValues) {
        editTrip(trip!.id, values);
        toast({
            title: "Trip Updated",
            description: `The trip to ${values.location} has been updated.`,
        });
        onOpenChange(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Trip</DialogTitle>
                    <DialogDescription>Update the details for your trip to {trip.location}.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="purpose" render={({ field }) => (
                            <FormItem><FormLabel>Purpose</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="amount" render={({ field }) => (
                                <FormItem><FormLabel>Budget</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="currency" render={({ field }) => (
                                <FormItem><FormLabel>Currency</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger></FormControl>
                                    <SelectContent>{SUPPORTED_CURRENCIES.map(c => (<SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>))}</SelectContent>
                                </Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <FormField control={form.control} name="status" render={({ field }) => (
                            <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approved</SelectItem>
                                    <SelectItem value="Not Approved">Not Approved</SelectItem>
                                </SelectContent>
                            </Select><FormMessage /></FormItem>
                        )} />
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
