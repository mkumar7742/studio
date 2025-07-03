
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const passwordValidation = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
);

const setupFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." })
           .regex(passwordValidation, {
             message: "Password must contain an uppercase letter, a lowercase letter, a number, and a special character."
           }),
});

type SetupFormValues = z.infer<typeof setupFormSchema>;

const PageSkeleton = () => (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center"><Skeleton className="h-8 w-32 mx-auto" /><Skeleton className="h-6 w-48 mx-auto mt-2" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    </div>
);


export default function SetupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingSetup, setIsCheckingSetup] = useState(true);

    useEffect(() => {
        async function checkSetup() {
            try {
                const response = await fetch('/api/setup/status');
                const data = await response.json();
                if (data.setupComplete) {
                    router.replace('/login');
                } else {
                    setIsCheckingSetup(false);
                }
            } catch (err) {
                setError("Could not verify application status. Please try again later.");
                setIsCheckingSetup(false);
            }
        }
        checkSetup();
    }, [router]);

    const form = useForm<SetupFormValues>({
        resolver: zodResolver(setupFormSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    async function onSubmit(values: SetupFormValues) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/setup/create-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An error occurred during setup.');
            }

            toast({
                title: "Administrator Created!",
                description: "The admin account has been created. Please log in to continue.",
            });
            router.push('/login');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }
    
    if (isCheckingSetup) {
        return <PageSkeleton />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <ShieldCheck className="size-8 text-primary" />
                        <span className="text-3xl font-bold text-foreground">TrackWise Setup</span>
                    </div>
                    <CardTitle className="text-2xl">Create System Administrator</CardTitle>
                    <CardDescription>This is a one-time setup for the main application administrator.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Admin Name" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="admin@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Create Administrator'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
