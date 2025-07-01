
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from "next/link";
import { useAppContext } from '@/context/app-provider';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Plane, MoreHorizontal, X, Pencil, Trash2, Calendar, User, Wallet, Info } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { TripDialog } from '@/components/trip-dialog';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import type { Trip } from '@/types';
import { format as formatDate, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const InfoRow = ({ icon: Icon, label, value, valueClassName }: { icon: React.ElementType, label: string, value: string, valueClassName?: string }) => (
    <div className="flex items-start gap-4">
        <Icon className="size-4 text-muted-foreground mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className={cn("font-semibold text-foreground", valueClassName)}>{value}</p>
        </div>
    </div>
);

export default function TripDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { trips, deleteTrip, members, editTrip } = useAppContext();
    const { toast } = useToast();
    
    const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);
    const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);

    const trip = trips.find(t => t.id === params.id);
    const member = trip ? members.find(m => m.id === trip.memberId) : null;
    
    if (!trip || !member) {
        return (
             <div className="flex flex-col h-full items-center justify-center bg-background text-foreground p-4 text-center">
                <h1 className="text-2xl font-bold">Trip not found</h1>
                <p className="text-muted-foreground mt-2">The requested trip could not be found or is invalid.</p>
                <Button asChild variant="outline" className="mt-4"><Link href="/trips">Back to Trips</Link></Button>
            </div>
        );
    }

    const handleConfirmDelete = () => {
        if (tripToDelete) {
            deleteTrip(tripToDelete.id);
            toast({
                title: "Trip Deleted",
                description: `The trip to ${tripToDelete.location} has been deleted.`,
            });
            router.push('/trips');
            setTripToDelete(null);
        }
    };
    
    const getStatusBadgeClass = (status: Trip['status']) => {
        switch(status) {
            case 'Approved': return 'bg-violet-600 hover:bg-violet-600/90 text-white';
            case 'Pending': return 'bg-pink-600 hover:bg-pink-600/90 text-white';
            case 'Not Approved': return 'bg-red-600 hover:bg-red-600/90 text-white';
            default: return '';
        }
    }

    const formattedDepartDate = formatDate(parseISO(trip.departDate), 'PPP');
    const formattedReturnDate = formatDate(parseISO(trip.returnDate), 'PPP');

    return (
        <div className="flex flex-col h-full bg-background text-foreground">
            <header className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Trip to {trip.location}
                    </h1>
                    <Badge className={cn("border-none", getStatusBadgeClass(trip.status))}>{trip.status}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setTripToEdit(trip)} className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold">
                        <Pencil className="mr-2" /> Edit
                    </Button>
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
                            <DropdownMenuItem onClick={() => setTripToDelete(trip)} className="text-destructive focus:bg-destructive/80 focus:text-destructive-foreground">
                                <Trash2 className="mr-2" /> Delete Trip
                            </DropdownMenuItem>
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
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl">Trip Summary</CardTitle>
                                <CardDescription>Key details for the trip to {trip.location}.</CardDescription>
                            </div>
                            <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500 text-white">
                                <Plane className="size-6" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoRow icon={Calendar} label="Departure Date" value={formattedDepartDate} />
                            <InfoRow icon={Calendar} label="Return Date" value={formattedReturnDate} />
                             <InfoRow icon={Wallet} label="Trip Budget" value={formatCurrency(trip.amount, trip.currency)} />
                            <div className="flex items-start gap-4">
                                <User className="size-4 text-muted-foreground mt-1" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Traveller</p>
                                    <div className="flex items-center gap-2 font-semibold text-foreground">
                                        <Avatar className="size-6">
                                            <AvatarImage src={member.avatar} data-ai-hint={member.avatarHint} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <Link href={`/members/${member.id}`} className="hover:underline">{member.name}</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <InfoRow icon={Info} label="Purpose" value={trip.purpose} />
                        {trip.hotel && <InfoRow icon={Plane} label="Hotel" value={trip.hotel} />}
                    </CardContent>
                </Card>
            </main>
            <TripDialog 
                trip={tripToEdit}
                open={!!tripToEdit}
                onOpenChange={(isOpen) => !isOpen && setTripToEdit(null)}
            />
             <DeleteConfirmationDialog
                open={!!tripToDelete}
                onOpenChange={(isOpen) => !isOpen && setTripToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Trip"
                description={`Are you sure you want to delete the trip to ${tripToDelete?.location}? This action cannot be undone.`}
            />
        </div>
    );
}
