
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightLeft, Banknote, ShieldCheck, Users, LayoutDashboard, PlusCircle, LogIn } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

const LoadingScreen = () => (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ElementType, title: string, description: string }) => {
    const Icon = icon;
    return (
        <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md">
            <div className="flex items-center justify-center size-12 bg-primary/10 text-primary rounded-full mb-4">
                <Icon className="size-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
};

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto h-16 flex items-center justify-between px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowRightLeft className="size-7 text-primary" />
                        <span className="text-xl font-bold">TrackWise</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Log In</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/setup">Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="py-20 md:py-32 text-center">
                    <div className="container mx-auto px-4 md:px-6">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                            Family Finance, <span className="text-primary">Simplified</span>.
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-8">
                            TrackWise is the easiest way for your family to manage expenses, track income, and build healthy financial habits together.
                        </p>
                        <Button size="lg" asChild>
                            <Link href="/setup">
                                Get Started Free <LogIn className="ml-2" />
                            </Link>
                        </Button>
                    </div>
                </section>

                <section className="py-20 bg-card/50">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">All-in-One Financial Hub</h2>
                            <p className="max-w-xl mx-auto text-muted-foreground mt-2">
                                Everything you need to keep your family's finances organized and on track.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={Banknote} 
                                title="Shared Expense Tracking" 
                                description="Easily log expenses and income. See who spent what and where your money is going in real-time."
                            />
                            <FeatureCard 
                                icon={Users} 
                                title="Family-First Roles" 
                                description="Designate a 'Family Head' with full access, while other members have their own private view of their contributions."
                            />
                            <FeatureCard 
                                icon={ShieldCheck} 
                                title="Approval Workflow" 
                                description="Members can request approval for large expenses, ensuring everyone is on the same page before a purchase is made."
                            />
                            <FeatureCard 
                                icon={LayoutDashboard} 
                                title="Insightful Dashboard" 
                                description="Visualize your family's financial health with charts for spending by category, member, and monthly trends."
                            />
                            <FeatureCard 
                                icon={PlusCircle} 
                                title="Custom Categories" 
                                description="Create custom spending categories with unique icons and colors to perfectly match your family's lifestyle."
                            />
                            <FeatureCard 
                                icon={ArrowRightLeft} 
                                title="Centralized Transactions" 
                                description="View a unified log of all income and expenses, with smart filters and powerful search capabilities."
                            />
                        </div>
                    </div>
                </section>
                <section className="py-20">
                    <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Take Control of Your Family's Future</h2>
                            <p className="text-muted-foreground text-lg mb-6">
                                Stop guessing and start knowing. TrackWise empowers you to make smarter financial decisions together. Sign up today and build a stronger financial foundation for your family.
                            </p>
                            <Button size="lg" asChild>
                            <Link href="/setup">
                                    Sign Up Now
                                </Link>
                            </Button>
                        </div>
                        <div className="order-1 md:order-2">
                            <Image 
                                src="https://placehold.co/600x400.png" 
                                alt="App screenshot"
                                data-ai-hint="finance dashboard"
                                width={600} 
                                height={400} 
                                className="rounded-lg shadow-2xl"
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-6 border-t">
                <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} TrackWise. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
