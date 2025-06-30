
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAppContext } from "@/context/app-provider";
import { Repeat, Clapperboard, Music, Cloud, Sparkles, Wifi, Home, Car, HeartPulse, Dumbbell, Pizza, ShoppingCart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Subscription } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format, parseISO } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

export const availableSubscriptionIcons: { name: string; icon: LucideIcon }[] = [
    { name: "Repeat", icon: Repeat },
    { name: "Clapperboard", icon: Clapperboard },
    { name: "Music", icon: Music },
    { name: "Cloud", icon: Cloud },
    { name: "Sparkles", icon: Sparkles },
    { name: "Wifi", icon: Wifi },
    { name: "Home", icon: Home },
    { name: "Car", icon: Car },
    { name: "HeartPulse", icon: HeartPulse },
    { name: "Dumbbell", icon: Dumbbell },
    { name: "Pizza", icon: Pizza },
    { name: "ShoppingCart", icon: ShoppingCart },
];

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  amount: z.coerce.number().positive({ message: "Amount must be a positive number." }),
  currency: z.string({ required_error: "Please select a currency." }),
  billingCycle: z.enum(["Monthly", "Yearly"], { required_error: "Please select a billing cycle." }),
  nextPaymentDate: z.date({ required_error: "A date is required." }),
  category: z.string({ required_error: "Please select a category." }),
  iconName: z.string({ required_error: "Please select an icon." }),
});

type SubscriptionFormValues = z.infer<typeof formSchema>;

interface SubscriptionFormProps {
  subscription?: Subscription | null;
  onFinished?: () => void;
}

export function SubscriptionForm({ subscription, onFinished }: SubscriptionFormProps) {
  const { addSubscription, editSubscription, categories } = useAppContext();
  const isEditing = !!subscription;

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: subscription?.name || "",
        amount: subscription?.amount || undefined,
        currency: subscription?.currency || "USD",
        billingCycle: subscription?.billingCycle || "Monthly",
        nextPaymentDate: subscription ? parseISO(subscription.nextPaymentDate) : new Date(),
        category: subscription?.category || "",
        iconName: subscription?.iconName || "Repeat",
    },
  });

  async function onSubmit(values: SubscriptionFormValues) {
    if (isEditing && subscription) {
      await editSubscription(subscription.id, values);
    } else {
      await addSubscription(values);
    }
    if (onFinished) {
      onFinished();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Netflix" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" placeholder="15.99" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <div className="col-span-1">
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Code" /></SelectTrigger></FormControl>
                                <SelectContent>{SUPPORTED_CURRENCIES.map(c => (<SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>))}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
        <FormField
          control={form.control}
          name="billingCycle"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Billing Cycle</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="Monthly" /></FormControl>
                    <FormLabel className="font-normal">Monthly</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl><RadioGroupItem value="Yearly" /></FormControl>
                    <FormLabel className="font-normal">Yearly</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nextPaymentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Next Payment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
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
          name="iconName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-6 gap-2"
                  >
                    {availableSubscriptionIcons.map(({ name, icon: Icon }) => (
                      <FormItem key={name} className="flex items-center justify-center">
                        <FormControl>
                          <RadioGroupItem value={name} className="sr-only" />
                        </FormControl>
                        <FormLabel
                          className={cn(
                            "flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 border-transparent bg-accent/50",
                            "ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            field.value === name && "ring-2 ring-ring ring-offset-2 bg-accent"
                          )}
                        >
                          <Icon className="size-5 text-accent-foreground" />
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">{isEditing ? "Save Changes" : "Add Subscription"}</Button>
      </form>
    </Form>
  );
}
