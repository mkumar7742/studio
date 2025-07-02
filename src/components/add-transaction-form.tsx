
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useAppContext } from "@/context/app-provider";
import { Switch } from "./ui/switch";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

const formSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Please select a transaction type.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  amount: z.coerce.number().positive({
      message: "Amount must be a positive number.",
  }),
  currency: z.string({ required_error: "Please select a currency." }),
  date: z.date({
    required_error: "A date is required.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  member: z.string().min(2, {
    message: "Member name must be at least 2 characters.",
  }),
  isRecurring: z.boolean().default(false),
  recurrenceFrequency: z.enum(["weekly", "monthly", "yearly"]).optional(),
}).refine(data => {
    if (data.isRecurring) {
        return !!data.recurrenceFrequency;
    }
    return true;
}, {
    message: "Please select a frequency for recurring transactions.",
    path: ["recurrenceFrequency"],
});

export type AddTransactionValues = z.infer<typeof formSchema>;

interface AddTransactionFormProps {
  onFinished?: () => void;
}

export function AddTransactionForm({ onFinished }: AddTransactionFormProps) {
  const { addTransaction, categories } = useAppContext();
  
  const form = useForm<AddTransactionValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      description: "",
      date: new Date(),
      member: "",
      isRecurring: false,
      currency: "USD",
      amount: 0,
      category: "",
    },
  });

  const isRecurring = form.watch('isRecurring');

  function handleFormSubmit(values: AddTransactionValues) {
    addTransaction({
        ...values,
        merchant: 'N/A', // Merchant not in this form, so provide default
    });
    form.reset({ date: new Date(), type: 'expense', description: '', category: '', amount: 0, currency: 'USD', member: "", isRecurring: false, recurrenceFrequency: undefined });
    if (onFinished) {
        onFinished();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Transaction Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex items-center space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="expense" />
                    </FormControl>
                    <FormLabel className="font-normal">Expense</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="income" />
                    </FormControl>
                    <FormLabel className="font-normal">Income</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Coffee" {...field} />
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
                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
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
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a currency" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {SUPPORTED_CURRENCIES.map((c) => (
                                    <SelectItem key={c.code} value={c.code}>
                                    {c.code}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
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
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="member"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                      <FormLabel>Recurring Transaction</FormLabel>
                      <FormDescription>
                          Does this transaction repeat over time?
                      </FormDescription>
                  </div>
                  <FormControl>
                      <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                      />
                  </FormControl>
              </FormItem>
          )}
        />
        {isRecurring && (
            <FormField
                control={form.control}
                name="recurrenceFrequency"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a frequency" />
                                </SelectTrigger>
                            </FormControl>
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
        <Button type="submit" className="w-full">Add Transaction</Button>
      </form>
    </Form>
  );
}
