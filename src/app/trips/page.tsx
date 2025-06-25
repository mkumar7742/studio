
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-provider";
import { cn } from '@/lib/utils';
import { Filter, MoreHorizontal, Plus, Plane, ListFilter, Eye } from 'lucide-react';
import type { Trip } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatCurrency } from '@/lib/currency';

export default function TripsPage() {
    const { trips } = useAppContext();
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedRows(new Set(trips.map(t => t.id)));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleSelectRow = (id: string, checked: boolean) => {
        const newSelectedRows = new Set(selectedRows);
        if (checked) {
            newSelectedRows.add(id);
        } else {
            newSelectedRows.delete(id);
        }
        setSelectedRows(newSelectedRows);
    };

    const allRowsSelected = trips.length > 0 && selectedRows.size === trips.length;
    const someRowsSelected = selectedRows.size > 0 && selectedRows.size < trips.length;

    const getStatusClasses = (status: Trip['status']) => {
        switch (status) {
            case 'Approved':
                return 'bg-violet-600 hover:bg-violet-600/90 text-white';
            case 'Pending':
                return 'bg-pink-600 hover:bg-pink-600/90 text-white';
            case 'Not Approved':
                return 'bg-red-600 hover:bg-red-600/90 text-white';
            default:
                return '';
        }
    }

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 sm:p-6">
                <h1 className="text-3xl font-bold tracking-tight">Trips</h1>
                <div className="flex items-center gap-2">
                    <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href="/trips/new">
                            <Plus className="mr-2 size-4" /> New trip
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                        <Filter className="size-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                        <ListFilter className="size-4" />
                    </Button>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                            <DropdownMenuItem>View Archived</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6">
                <Card className="bg-card">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-border/50">
                                    <TableHead className="w-[50px] pl-4">
                                        <Checkbox 
                                            checked={allRowsSelected || (someRowsSelected ? 'indeterminate' : false)}
                                            onCheckedChange={handleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="text-muted-foreground font-bold">DETAILS</TableHead>
                                    <TableHead className="text-muted-foreground font-bold">PURPOSE</TableHead>
                                    <TableHead className="text-muted-foreground font-bold">AMOUNT</TableHead>
                                    <TableHead className="text-muted-foreground font-bold">EXPENSE REPORT</TableHead>
                                    <TableHead className="text-muted-foreground font-bold">STATUS</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {trips.map((trip) => (
                                    <TableRow key={trip.id} className="border-border/20 font-medium">
                                        <TableCell className="pl-4">
                                            <Checkbox
                                                checked={selectedRows.has(trip.id)}
                                                onCheckedChange={(checked) => handleSelectRow(trip.id, !!checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white">
                                                    <Plane className="size-4" />
                                                </div>
                                                <div>
                                                    <div className="text-xs text-muted-foreground">{trip.date}</div>
                                                    <div className="font-semibold">{trip.location}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{trip.purpose}</TableCell>
                                        <TableCell>{formatCurrency(trip.amount, trip.currency)}</TableCell>
                                        <TableCell>{trip.report.replace('_', ' ')}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant="outline"
                                                className={cn("border-none rounded-md text-xs font-semibold py-1 px-2.5", getStatusClasses(trip.status))}
                                            >
                                                {trip.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="link" size="sm" className="font-semibold text-cyan-400 hover:text-cyan-500">
                                                <Link href={`/trips/${trip.id}`}>
                                                    <Eye className="size-4" />
                                                    View
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
