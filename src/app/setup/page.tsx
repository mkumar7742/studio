
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, ArrowRightLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

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

export default function SetupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<SetupFormValues>({
        resolver: zodResolver(setupFormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: SetupFormValues) {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5001/api/setup/create-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An error occurred during setup.');
            }

            toast({
                title: "Setup Complete!",
                description: "Your Family Head account has been created. Please log in.",
            });
            router.push('/login');

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <ArrowRightLeft className="size-8 text-primary" />
                        <span className="text-3xl font-bold text-foreground">TrackWise</span>
                    </div>
                    <CardTitle className="text-2xl">Welcome!</CardTitle>
                    <CardDescription>Let's set up your Family Head account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
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
                                            <Input type="email" placeholder="family.head@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
