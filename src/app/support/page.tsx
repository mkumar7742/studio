
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
import { useState, useMemo } from 'react';
import { Search, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type SupportTicket = {
    id: string;
    subject: string;
    status: 'Open' | 'In Progress' | 'Closed';
    date: string;
}

const categorizedFaqs = [
  {
    category: "Getting Started",
    faqs: [
      {
        question: "How do I add a new transaction?",
        answer: "You can add a new transaction by navigating to the 'Expenses' or 'Income' pages and clicking the 'New Expense' or 'New Income' button. Alternatively, you can use the quick access cards on the dashboard."
      },
      {
        question: "How do I connect a bank account?",
        answer: "This is a demo application, so bank account connections are not live. The accounts shown are for demonstration purposes only. You can manage them on the 'Accounts' page."
      }
    ]
  },
  {
    category: "Features",
    faqs: [
      {
        question: "Can I create custom categories?",
        answer: "Yes! Go to the 'Categories' page to add, edit, and manage your own custom categories with unique icons and colors."
      },
      {
        question: "How do budgets work?",
        answer: "You can set monthly budgets for specific spending categories on the 'Budgets' page. The app will track your spending in that category against the allocated amount for the current month."
      }
    ]
  },
  {
    category: "Account & Security",
    faqs: [
      {
        question: "How do I change my password?",
        answer: "You can manage your profile information, including security settings, on the 'Profile' page. Since this is a demo, password functionality is not implemented."
      },
      {
        question: "Is my data secure?",
        answer: "We prioritize your data security. All data is stored securely and we never share your personal information with third parties. This is a demo application, and data is stored locally in your browser."
      }
    ]
  }
];

const supportFormSchema = z.object({
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type SupportFormValues = z.infer<typeof supportFormSchema>;

export default function SupportPage() {
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [tickets, setTickets] = useState<SupportTicket[]>([
        { id: 'TKT-001', subject: 'Issue with budget calculation', status: 'In Progress', date: '2 days ago'},
        { id: 'TKT-002', subject: 'How to export data?', status: 'Closed', date: '1 week ago'},
    ]);

    const form = useForm<SupportFormValues>({
        resolver: zodResolver(supportFormSchema),
        defaultValues: {
            subject: '',
            message: '',
        }
    });

    function onSubmit(values: SupportFormValues) {
        const newTicket: SupportTicket = {
            id: `TKT-00${tickets.length + 3}`,
            subject: values.subject,
            status: 'Open',
            date: 'Just now'
        };
        setTickets(prev => [newTicket, ...prev]);
        toast({
            title: "Ticket Submitted!",
            description: "Thanks for reaching out. We'll get back to you shortly.",
        });
        form.reset();
    }
    
    const filteredFaqs = useMemo(() => {
        if (!searchTerm) return categorizedFaqs;
        
        const lowercasedFilter = searchTerm.toLowerCase();
        
        return categorizedFaqs.map(category => ({
            ...category,
            faqs: category.faqs.filter(faq => 
                faq.question.toLowerCase().includes(lowercasedFilter) || 
                faq.answer.toLowerCase().includes(lowercasedFilter)
            )
        })).filter(category => category.faqs.length > 0);
    }, [searchTerm]);

    const getStatusIcon = (status: SupportTicket['status']) => {
        switch (status) {
            case 'Open': return <MessageSquare className="size-4 text-blue-500" />;
            case 'In Progress': return <Clock className="size-4 text-yellow-500" />;
            case 'Closed': return <CheckCircle className="size-4 text-green-500" />;
        }
    };
    
    const getStatusBadge = (status: SupportTicket['status']) => {
        switch (status) {
            case 'Open': return 'bg-blue-500/20 text-blue-400 border-transparent';
            case 'In Progress': return 'bg-yellow-500/20 text-yellow-400 border-transparent';
            case 'Closed': return 'bg-green-500/20 text-green-400 border-transparent';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Support Center" description="Get help and answers to your questions." />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Knowledge Base</CardTitle>
                            <CardDescription>Find answers to common questions about TrackWise.</CardDescription>
                            <div className="relative pt-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search FAQs..." 
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="multiple" className="w-full">
                                {filteredFaqs.map((category) => (
                                    <div key={category.category}>
                                        <h3 className="text-lg font-semibold my-4">{category.category}</h3>
                                        {category.faqs.map((faq, index) => (
                                            <AccordionItem key={index} value={`${category.category}-${index}`}>
                                                <AccordionTrigger>{faq.question}</AccordionTrigger>
                                                <AccordionContent>{faq.answer}</AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </div>
                                ))}
                            </Accordion>
                            {filteredFaqs.length === 0 && (
                                <p className="text-center text-muted-foreground py-8">No matching FAQs found.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Submit a Ticket</CardTitle>
                            <CardDescription>Still have questions? Send us a message.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                                    <Textarea placeholder="Describe your issue in detail..." {...field} rows={5} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full">Create Ticket</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Recent Tickets</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-4">
                                {tickets.map(ticket => (
                                    <li key={ticket.id} className="flex items-start gap-4">
                                        {getStatusIcon(ticket.status)}
                                        <div className="flex-grow">
                                            <p className="font-semibold">{ticket.subject}</p>
                                            <p className="text-sm text-muted-foreground">{ticket.id} &middot; {ticket.date}</p>
                                        </div>
                                        <Badge className={cn("text-xs font-semibold", getStatusBadge(ticket.status))}>
                                            {ticket.status}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
