
"use client";

import { useState } from "react";
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/context/app-provider";
import { cn } from "@/lib/utils";
import type { Approval } from "@/types";
import { Check, Eye, Filter, ListFilter, MoreHorizontal, X } from "lucide-react";
import { ApprovalRequestDialog } from "@/components/approval-request-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export default function ApprovalsPage() {
    const { approvals, members } = useAppContext();
    const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleViewClick = (approval: Approval) => {
        setSelectedApproval(approval);
        setIsDialogOpen(true);
    };

    const getCategoryBadgeClasses = (category: Approval['category']) => {
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
    
    const euroFormatter = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
    });

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
                                    <TableHead className="text-muted-foreground font-bold uppercase">Category</TableHead>
                                    <TableHead className="text-muted-foreground font-bold uppercase">Amount</TableHead>
                                    <TableHead className="text-muted-foreground font-bold uppercase">Frequency</TableHead>
                                    <TableHead className="text-muted-foreground font-bold uppercase">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {approvals.map((approval) => {
                                    const member = members.find(m => m.name === approval.owner.name);
                                    return (
                                        <TableRow key={approval.id} className="border-border/20 font-medium">
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8">
                                                        <AvatarImage src={approval.owner.avatar} alt={approval.owner.name} data-ai-hint={approval.owner.avatarHint} />
                                                        <AvatarFallback>{approval.owner.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold">
                                                            {member ? (
                                                                <Link href={`/members/${member.id}`} className="hover:underline">
                                                                    {approval.owner.name}
                                                                </Link>
                                                            ) : (
                                                                approval.owner.name
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{approval.owner.title}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={cn("rounded-md font-semibold", getCategoryBadgeClasses(approval.category))}>
                                                    {approval.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{euroFormatter.format(approval.amount)}</TableCell>
                                            <TableCell>{approval.frequency}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-4">
                                                    <button className="text-muted-foreground hover:text-foreground" onClick={() => handleViewClick(approval)}>
                                                        <Eye className="size-5" />
                                                    </button>
                                                    <button className="text-green-500 hover:text-green-400">
                                                        <Check className="size-5" />
                                                    </button>
                                                    <button className="text-red-500 hover:text-red-400">
                                                        <X className="size-5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
            <ApprovalRequestDialog
                approval={selectedApproval}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
        </div>
    )
}
