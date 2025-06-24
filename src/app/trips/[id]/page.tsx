'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plane, BedDouble, Car, MoreHorizontal, X, Check, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

const Section = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <Icon className="size-5 text-muted-foreground" />
            <h2 className="font-semibold text-lg text-foreground">{title}</h2>
        </div>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoRow = ({ label, value, valueClassName }: { label: string, value: string, valueClassName?: string }) => (
    <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("font-semibold text-foreground", valueClassName)}>{value}</p>
    </div>
)

export default function TripDetailPage({ params }: { params: { id: string } }) {
    // In a real app, you would fetch trip data based on params.id
    // For this example, we'll use static data that matches the design.
    const trip = {
        location: 'Brussels',
        date: '11/11/2022',
        status: 'Pending'
    };

    const euroFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    });

    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            <header className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Trips - {trip.location} {trip.date}
                    </h1>
                    <Badge className="bg-pink-600 hover:bg-pink-600/90 text-white border-none">{trip.status}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="default">Edit</Button>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-5" />
                    </Button>
                    <Link href="/trips">
                        <Button variant="ghost" size="icon">
                            <X className="size-5" />
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <p className="text-sm text-muted-foreground">Duration: November 11 - November 20</p>
                        
                        <Section icon={Plane} title="Flight">
                            <Card className="bg-muted/50">
                                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] items-center gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">11 Nov</p>
                                        <p className="font-bold">Stockholm</p>
                                        <p className="text-muted-foreground">Arlanda Airport (ARN)</p>
                                    </div>
                                    <ArrowRight className="size-4 text-muted-foreground hidden md:block" />
                                    <div>
                                        <p className="font-bold">Brussels</p>
                                        <p className="text-muted-foreground">Brussels Airport (BRU)</p>
                                    </div>
                                    <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
                                        <div className="flex items-center justify-between"><span>Economy Class</span> <Check className="size-4 text-green-500" /></div>
                                        <div className="flex items-center justify-between text-muted-foreground"><span>Early check-in</span> <X className="size-4 text-red-500" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/50">
                                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] items-center gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">20 Nov</p>
                                        <p className="font-bold">Brussels</p>
                                        <p className="text-muted-foreground">Brussels Airport (BRU)</p>
                                    </div>
                                    <ArrowRight className="size-4 text-muted-foreground hidden md:block" />
                                    <div>
                                        <p className="font-bold">Stockholm</p>
                                        <p className="text-muted-foreground">Arlanda Airport (ARN)</p>
                                    </div>
                                    <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
                                        <div className="flex items-center justify-between"><span>Economy Class</span> <Check className="size-4 text-green-500" /></div>
                                        <div className="flex items-center justify-between text-muted-foreground"><span>Early check-in</span> <X className="size-4 text-red-500" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Section>

                        <Section icon={BedDouble} title="Hotel">
                             <Card className="bg-muted/50">
                                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 items-center gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">11 Nov - 20 Nov</p>
                                        <p className="font-bold">Superior Hotel *****</p>
                                    </div>
                                    <div className="border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
                                        <div className="flex items-center justify-between"><span>Queen Suite</span> <Check className="size-4 text-green-500" /></div>
                                        <div className="flex items-center justify-between"><span>Early check-in</span> <Check className="size-4 text-green-500" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Section>
                        
                        <Section icon={Car} title="Transfer">
                            <Card className="bg-muted/50 h-24 flex items-center justify-center">
                                <p className="text-muted-foreground">-</p>
                            </Card>
                        </Section>

                        <Button variant="outline" className="w-full">
                            <Plus className="mr-2 size-4" /> Add section
                        </Button>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="bg-card sticky top-6">
                            <CardContent className="p-6 space-y-4">
                                <InfoRow label="Approved by" value="Clara from Ops Team" />
                                <InfoRow label="Policy" value="Basic/Company" />
                                <InfoRow label="Travel documents" value="Provided" />
                                <InfoRow label="Purpose" value="Client Visit" />
                                <InfoRow label="Spending budget" value={euroFormatter.format(1500)} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
