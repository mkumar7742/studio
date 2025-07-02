
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { X, PenSquare, Tag, BookText, Plane, CircleDollarSign, BedDouble, PlaneTakeoff, PlaneLanding, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAppContext } from '@/context/app-provider';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const tripFormSchema = z.object({
  location: z.string().min(2, { message: "Location name is required." }),
  purpose: z.string().min(3, { message: "Purpose must be at least 3 characters." }),
  departDate: z.date({ required_error: "Departure date is required." }),
  returnDate: z.date({ required_error: "Return date is required." }),
  amount: z.coerce.number().positive({ message: "Budget must be a positive number." }),
  currency: z.string({ required_error: "Please select a currency." }),
  hotel: z.string().optional(),
}).refine(data => data.returnDate >= data.departDate, {
    message: "Return date cannot be before departure date.",
    path: ["returnDate"],
});


type TripFormValues = z.infer<typeof tripFormSchema>;

export default function NewTripPage() {
    const { addTrip, currentUser } = useAppContext();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<TripFormValues>({
        resolver: zodResolver(tripFormSchema),
        defaultValues: {
            currency: 'USD',
            location: '',
            purpose: '',
            amount: '' as any,
            hotel: '',
        }
    });

    function onSubmit(values: TripFormValues) {
        addTrip({
            ...values,
            departDate: format(values.departDate, 'yyyy-MM-dd'),
            returnDate: format(values.returnDate, 'yyyy-MM-dd'),
            memberId: currentUser.id,
        });
        toast({
            title: "Trip Created",
            description: `Successfully created new trip to ${values.location}`,
        });
        router.push('/trips');
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-screen bg-background text-foreground p-6 md:p-8">
                <header className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">New Trip</h1>
                    <Link href="/trips">
                        <Button variant="ghost" size="icon">
                            <X className="size-6" />
                        </Button>
                    </Link>
                </header>
                <Separator className="bg-border mb-8" />
                
                <div className="flex-1 overflow-y-auto space-y-8 pr-2">
                    <div className="space-y-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <>
                                    <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sky-500 text-white"><PenSquare className="size-4" /></div><span>Location*</span></Label>
                                    <FormItem className="w-full"><FormControl><Input className="bg-card border-border" {...field} placeholder="e.g. Brussels" /></FormControl><FormMessage /></FormItem>
                                </>
                            )}
                        />

                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-purple-500 text-white"><Tag className="size-4" /></div><span>Type*</span></Label>
                        <RadioGroup defaultValue="international" className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="domestic" id="domestic" /><Label htmlFor="domestic" className="font-normal text-muted-foreground">Domestic</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="international" id="international" className="text-cyan-400 border-cyan-400" /><Label htmlFor="international" className="font-normal text-cyan-400">International</Label></div>
                        </RadioGroup>

                        <FormField
                            control={form.control}
                            name="purpose"
                            render={({ field }) => (
                                <>
                                    <Label className="flex items-center gap-4 self-start pt-2"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-500 text-white"><BookText className="size-4" /></div><span>Purpose*</span></Label>
                                    <FormItem className="w-full"><FormControl><Textarea className="bg-card border-border min-h-[80px]" {...field} /></FormControl><FormMessage /></FormItem>
                                </>
                            )}
                        />
                    </div>
                    
                    <div className="space-y-6">
                        <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground">ITINERARY</h2>
                        
                        <div className="space-y-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                            <Label className="font-semibold text-foreground flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white"><Plane className="size-4" /></div><span>FLIGHT</span></Label>
                            <RadioGroup defaultValue="roundtrip" className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="one-way" id="one-way" /><Label htmlFor="one-way" className="font-normal text-muted-foreground">One-way</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="roundtrip" id="roundtrip" className="text-cyan-400 border-cyan-400" /><Label htmlFor="roundtrip" className="font-normal text-cyan-400">Roundtrip</Label></div>
                            </RadioGroup>
                            
                            <FormField
                                control={form.control}
                                name="departDate"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-orange-500 text-white"><PlaneTakeoff className="size-4" /></div><span>Depart from*</span></Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Input placeholder="City or Airport" className="bg-card border-border" />
                                            <FormItem className="w-full">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal bg-card border-border", !field.value && "text-muted-foreground")}>
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        </div>
                                    </>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="returnDate"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-cyan-500 text-white"><PlaneLanding className="size-4" /></div><span>Destination*</span></Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <Input placeholder="City or Airport" className="bg-card border-border" />
                                             <FormItem className="w-full">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal bg-card border-border", !field.value && "text-muted-foreground")}>
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        </div>
                                    </>
                                )}
                            />

                            <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-green-500 text-white"><CircleDollarSign className="size-4" /></div><span>Trip Budget*</span></Label>
                            <div className="grid grid-cols-3 gap-4">
                                <FormField control={form.control} name="amount" render={({ field }) => (<FormItem className="col-span-2"><FormControl><Input type="number" className="bg-card border-border" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="currency" render={({ field }) => (<FormItem className="col-span-1"><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger className="bg-card border-border"><SelectValue placeholder="Currency" /></SelectTrigger></FormControl><SelectContent>{SUPPORTED_CURRENCIES.map(c => (<SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-base font-semibold uppercase tracking-wider text-muted-foreground">ACCOMMODATION</h2>
                        <div className="space-y-6 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-4 gap-y-6 items-center">
                            <FormField
                                control={form.control}
                                name="hotel"
                                render={({ field }) => (
                                    <>
                                        <Label className="flex items-center gap-4"><div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-amber-500 text-white"><BedDouble className="size-4" /></div><span>Hotel</span></Label>
                                        <FormItem className="w-full"><FormControl><Input className="bg-card border-border" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <footer className="flex justify-end items-center mt-6 pt-6 gap-4">
                    <Button type="button" variant="outline">Save draft</Button>
                    <Button type="submit" className="bg-cyan-400 hover:bg-cyan-500 text-black border-none font-bold px-6">Save</Button>
                </footer>
            </form>
        </Form>
    );
}
