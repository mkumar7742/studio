
"use client";

import Link from 'next/link';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppContext } from "@/context/app-provider";
import type { Transaction } from "@/types";
import { format } from 'date-fns';
import { Repeat } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCurrency } from '@/lib/currency';

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

export default function TransactionsPage() {
    const { visibleTransactions, members } = useAppContext();

    return (
        <div className="flex flex-col h-full">
            <PageHeader title="Transactions" description="View and manage your transactions." showAddTransaction />
            <main className="flex-1 overflow-y-auto">
                <Card className="m-4 sm:m-6">
                    <CardHeader>
                        <CardTitle>All Transactions</CardTitle>
                        <CardDescription>A complete log of your income and expenses.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visibleTransactions.length > 0 ? (
                                visibleTransactions.map((txn: Transaction) => {
                                    const member = members.find(m => m.name === txn.member);
                                    return (
                                    <TableRow key={txn.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <CategoryIcon categoryName={txn.category} />
                                                <div>
                                                    <div className="font-medium flex items-center gap-2">
                                                        {txn.description}
                                                        {txn.isRecurring && (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger>
                                                                        <Repeat className="size-4 text-muted-foreground" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Recurring {txn.recurrenceFrequency}</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                    </div>
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
                                        <TableCell className="hidden sm:table-cell">{format(new Date(txn.date), 'MMMM d, yyyy')}</TableCell>
                                        <TableCell
                                            className={`text-right font-medium ${
                                            txn.type === "income"
                                                ? "text-emerald-600"
                                                : "text-foreground"
                                            }`}
                                        >
                                            {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount, txn.currency)}
                                        </TableCell>
                                    </TableRow>
                                );
                                })
                                ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                    No transactions found.
                                    </TableCell>
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
