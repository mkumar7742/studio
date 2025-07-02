
"use client";

import { useState, useMemo } from "react";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/context/app-provider";
import { cn } from "@/lib/utils";
import type { Approval, Trip, Transaction } from "@/types";
import { Check, Eye, Filter, ListFilter, MoreHorizontal, X, Plane, CreditCard } from "lucide-react";
import { ApprovalRequestDialog } from "@/components/approval-request-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";

type UnifiedApprovalItem = {
    id: string;
    type: 'approval' | 'trip' | 'transaction';
    owner: { name: string; title: string; avatar: string; avatarHint: string };
    category: string;
    description: string;
    amount: number;
    currency: string;
    date: string;
    original: Approval | Trip | Transaction;
};


export default function ApprovalsPage() {
    const { approvals, trips, transactions, members, updateApprovalStatus, editTrip, updateTransactionStatus } = useAppContext();
    const { toast } = useToast();
    const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const itemsToApprove = useMemo(() => {
        const combined: UnifiedApprovalItem[] = [];

        // From legacy approvals model
        approvals.filter(a => a.status === 'Pending').forEach(a => {
            combined.push({
                id: a.id,
                type: 'approval',
                owner: a.owner,
                category: a.category,
                description: a.description,
                amount: a.amount,
                currency: a.currency,
                date: new Date().toISOString(),
                original: a
            });
        });

        // From trips
        trips.filter(t => t.status === 'Pending').forEach(t => {
            const member = members.find(m => m.id === t.memberId);
            if (member) {
                combined.push({
                    id: t.id,
                    type: 'trip',
                    owner: { name: member.name, title: 'Trip Request', avatar: member.avatar, avatarHint: member.avatarHint },
                    category: 'Travel',
                    description: `Trip to ${t.location}`,
                    amount: t.amount,
                    currency: t.currency,
                    date: t.departDate,
                    original: t
                });
            }
        });

        // From transactions submitted for reimbursement
        transactions.filter(t => t.reimbursable && t.status === 'Submitted').forEach(t => {
            const member = members.find(m => m.name === t.member);
            if (member) {
                combined.push({
                    id: t.id,
                    type: 'transaction',
                    owner: { name: member.name, title: 'Expense Claim', avatar: member.avatar, avatarHint: member.avatarHint },
                    category: t.category,
                    description: t.description,
                    amount: t.amount,
                    currency: t.currency,
                    date: t.date,
                    original: t
                });
            }
        });

        return combined.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [approvals, trips, transactions, members]);

    const handleViewClick = (item: UnifiedApprovalItem) => {
        if (item.type === 'approval') {
            setSelectedApproval(item.original as Approval);
            setIsDialogOpen(true);
        } else if (item.type === 'trip') {
            // Trips have a dedicated page, so we could navigate there.
            // For now, let's just log it or show a toast.
            toast({ title: "View Trip", description: "Use the Trips page to see full trip details."});
        } else {
             toast({ title: "View Expense", description: "Use the Expenses page to see full expense details."});
        }
    };

    const handleApprovalAction = (item: UnifiedApprovalItem, status: 'Approved' | 'Declined') => {
        if (item.type === 'approval') {
            updateApprovalStatus(item.id, status);
        } else if (item.type === 'trip') {
            editTrip(item.id, { status });
        } else if (item.type === 'transaction') {
            updateTransactionStatus(item.id, status);
        }
        
        toast({
            title: `Request ${status}`,
            description: `The request has been successfully ${status.toLowerCase()}.`
        });
    }

    const getCategoryBadgeClasses = (category: string) => {
        switch (category) {
            case 'Travel':
                return 'bg-indigo-500/20 text-indigo-400 border-transparent hover:bg-indigo-500/30';
            case 'Food':
                return 'bg-red-500/20 text-red-400 border-transparent hover:bg-red-500/30';
            case 'Software':
                return 'bg-pink-500/20 text-pink-400 border-transparent hover:bg-pink-500/30';
            default:
                return 'bg-muted text-muted-foreground border-transparent';
        }
    };

    const TypeIcon = ({type}: {type: UnifiedApprovalItem['type']}) => {
        if (type === 'trip') return <Plane className="size-4 text-blue-500"/>
        if (type === 'transaction') return <CreditCard className="size-4 text-red-500"/>
        return <Eye className="size-4"/>
    }

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 sm:p-6">
                <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
                <div className="flex items-center gap-2">
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
                                <TableRow className="hover:bg-transparent border-b-border/50">
                                    <TableHead className="text-muted-foreground font-bold uppercase">Owner</TableHead>
                                    <TableHead className="text-muted-foreground font-bold uppercase">Description</TableHead>
                                    <TableHead className="text-muted-foreground font-bold uppercase">Category</TableHead>
                                    <TableHead className="text-muted-foreground font-bold uppercase">Date</TableHead>
                                    <TableHead className="text-muted-foreground font-bold uppercase">Amount</TableHead>
                                    <TableHead className="text-muted-foreground font-bold uppercase">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {itemsToApprove.map((item) => {
                                    const member = members.find(m => m.name === item.owner.name);
                                    return (
                                        <TableRow key={`${item.type}-${item.id}`} className="border-border/20 font-medium">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8">
                                                        <AvatarImage src={item.owner.avatar} alt={item.owner.name} data-ai-hint={item.owner.avatarHint} />
                                                        <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold">
                                                            {member ? (
                                                                <Link href={`/members/${member.id}`} className="hover:underline">
                                                                    {item.owner.name}
                                                                </Link>
                                                            ) : (
                                                                item.owner.name
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{item.owner.title}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("rounded-md font-semibold", getCategoryBadgeClasses(item.category))}>
                                                    {item.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{format(parseISO(item.date), 'MMM d, yyyy')}</TableCell>
                                            <TableCell>{formatCurrency(item.amount, item.currency)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <button className="text-muted-foreground hover:text-foreground" onClick={() => handleViewClick(item)}>
                                                        <TypeIcon type={item.type}/>
                                                    </button>
                                                    <button className="text-green-500 hover:text-green-400" onClick={() => handleApprovalAction(item, 'Approved')}>
                                                        <Check className="size-5" />
                                                    </button>
                                                    <button className="text-red-500 hover:text-red-400" onClick={() => handleApprovalAction(item, 'Declined')}>
                                                        <X className="size-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                 {itemsToApprove.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No pending approvals.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
            <ApprovalRequestDialog
                approval={selectedApproval}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onAction={(id, status) => updateApprovalStatus(id, status)}
            />
        </div>
    )
}
