
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/context/app-provider";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types";
import { format } from "date-fns";
import Link from 'next/link';
import { formatCurrency } from "@/lib/currency";

interface DayData {
  net: number;
  income: number;
  expense: number;
  transactions: Transaction[];
}

interface DayTransactionsDialogProps {
  day: { date: Date; data: DayData } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoryIcon = ({ categoryName }: { categoryName: string }) => {
    const { categories } = useAppContext();
    const category = categories.find((c) => c.name === categoryName);
    const Icon = category?.icon;
    return Icon ? (
      <div className="flex size-8 items-center justify-center rounded-full bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
    ) : null;
};

export function DayTransactionsDialog({ day, open, onOpenChange }: DayTransactionsDialogProps) {
    const { members } = useAppContext();
    
    if (!day) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Transactions for {format(day.date, 'PPP')}</DialogTitle>
                    <DialogDescription>
                        A log of all income and expenses for this day. Net total is in USD.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto -mx-6 px-6">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {day.data.transactions.length > 0 ? (
                            day.data.transactions.map((txn: Transaction) => {
                                const member = members.find(m => m.name === txn.member);
                                return (
                                <TableRow key={txn.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <CategoryIcon categoryName={txn.category} />
                                            <div>
                                                <div className="font-medium">{txn.description}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {txn.category} &middot;{' '}
                                                    {member ? (
                                                        <Link href={`/members/${member.id}`} className="hover:underline">
                                                            {txn.member}
                                                        </Link>
                                                    ) : (
                                                        txn.member
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        className={cn("text-right font-medium",
                                            txn.type === "income" ? "text-primary" : "text-destructive"
                                        )}
                                    >
                                        {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount, txn.currency)}
                                    </TableCell>
                                </TableRow>
                            );
                            })
                            ) : (
                            <TableRow>
                                <TableCell colSpan={2} className="h-24 text-center">
                                No transactions found.
                                </TableCell>
                            </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-between items-center font-bold border-t pt-4">
                    <span>Net Total:</span>
                     <span className={cn(
                        day.data.net >= 0 ? "text-primary" : "text-destructive"
                    )}>
                        {day.data.net >= 0 ? '+' : ''}{formatCurrency(day.data.net, 'USD')}
                    </span>
                </div>
            </DialogContent>
        </Dialog>
    );
}
