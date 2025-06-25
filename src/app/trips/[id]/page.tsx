
'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Plane, BedDouble, Car, MoreHorizontal, X, Check, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/currency";

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
    <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
        <Icon className="size-5 text-muted-foreground" />
        <h2 className="font-semibold text-lg text-foreground">{title}</h2>
    </div>
);


const InfoRow = ({ label, value, valueClassName }: { label: string, value: string, valueClassName?: string }) => (
    <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className={cn("font-bold text-base text-foreground", valueClassName)}>{value}</p>
    </div>
)

export default function TripDetailPage({ params }: { params: { id: string } }) {
    // In a real app, you would fetch trip data based on params.id
    // For this example, we'll use static data that matches the design.
    const trip = {
        location: 'Brussels',
        date: '11/11/2022',
        status: 'Pending',
        budget: 1500,
        currency: 'EUR'
    };

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
                    <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold">Edit</Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:bg-destructive/80 focus:text-destructive-foreground">Delete Trip</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Link href="/trips">
                        <Button variant="ghost" size="icon">
                            <X className="size-5" />
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <p className="text-sm text-muted-foreground">Duration: November 11 - November 20</p>
                        
                        <div className="space-y-3">
                            <SectionHeader icon={Plane} title="Flight" />
                            <Card className="bg-card">
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
                                    <div className="border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0 space-y-1">
                                        <div className="flex items-center justify-between"><span>Economy Class</span> <Check className="size-4 text-green-500" /></div>
                                        <div className="flex items-center justify-between text-muted-foreground"><span>Early check-in</span> <X className="size-4 text-red-500" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-card">
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
                                    <div className="border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0 space-y-1">
                                        <div className="flex items-center justify-between"><span>Economy Class</span> <Check className="size-4 text-green-500" /></div>
                                        <div className="flex items-center justify-between text-muted-foreground"><span>Early check-in</span> <X className="size-4 text-red-500" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <SectionHeader icon={BedDouble} title="Hotel" />
                             <Card className="bg-card">
                                <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 items-center gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">11 Nov - 20 Nov</p>
                                        <p className="font-bold">Superior Hotel *****</p>
                                    </div>
                                    <div className="border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0 space-y-1">
                                        <div className="flex items-center justify-between"><span>Queen Suite</span> <Check className="size-4 text-green-500" /></div>
                                        <div className="flex items-center justify-between"><span>Early check-in</span> <Check className="size-4 text-green-500" /></div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div className="space-y-3">
                             <SectionHeader icon={Car} title="Transfer" />
                             <Card className="bg-card h-14 flex items-center justify-center">
                                <p className="text-muted-foreground">-</p>
                            </Card>
                        </div>

                        <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start p-3 bg-muted rounded-lg border-none hover:bg-muted/80 text-foreground h-auto">
                                <Plus className="mr-4 size-5 text-muted-foreground" />
                                <span className="font-semibold text-lg">Add section</span>
                            </Button>
                            <Card className="bg-card border-dashed">
                                <CardContent className="p-4 flex justify-between text-muted-foreground">
                                    <span>-</span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <Card className="bg-card sticky top-6">
                            <CardContent className="p-6 space-y-6">
                                <InfoRow label="Approved by:" value="Clara from Ops Team" />
                                <InfoRow label="Travel Policy:" value="Basic/Company" />
                                <InfoRow label="Travel documents:" value="Provided" />
                                <InfoRow label="Purpose:" value="Client Visit" />
                                <InfoRow label="Trip Budget:" value={formatCurrency(trip.budget, trip.currency)} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
