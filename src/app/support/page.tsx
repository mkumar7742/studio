
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const faqs = [
  {
    question: "How do I add a new transaction?",
    answer: "You can add a new transaction by navigating to the 'Expenses' or 'Income' pages and clicking the 'New Expense' or 'New Income' button. Alternatively, you can use the quick access cards on the dashboard."
  },
  {
    question: "Can I create custom categories?",
    answer: "Yes! Go to the 'Categories' page to add, edit, and manage your own custom categories with unique icons and colors."
  },
  {
    question: "How do budgets work?",
    answer: "You can set monthly budgets for specific spending categories on the 'Budgets' page. The app will track your spending in that category against the allocated amount for the current month."
  },
  {
    question: "Is my data secure?",
    answer: "We prioritize your data security. All data is stored securely and we never share your personal information with third parties. This is a demo application, and data is stored locally in your browser."
  }
];

const supportFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

export default function SupportPage() {
    const { toast } = useToast();
    const form = useForm<SupportFormValues>({
        resolver: zodResolver(supportFormSchema),
        defaultValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        }
    });

    function onSubmit(values: SupportFormValues) {
        console.log(values);
        toast({
            title: "Message Sent!",
            description: "Thanks for reaching out. We'll get back to you shortly.",
        });
        form.reset();
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Support" description="Get help and answers to your questions." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                            <CardDescription>Find answers to common questions about TrackWise.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>{faq.answer}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Us</CardTitle>
                            <CardDescription>Still have questions? Send us a message.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Your Name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input type="email" placeholder="your.email@example.com" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Subject</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="How can we help?" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Message</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Your message..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">Send Message</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
