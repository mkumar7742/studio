
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
import { Filter, MoreHorizontal, Plus, Repeat } from 'lucide-react';
import type { Category, Transaction } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/currency';

export default function ExpensesPage() {
    const { transactions: allTransactions, categories, members } = useAppContext();
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

    const transactions = allTransactions.filter(t => t.type === 'expense');

    const handleSelectAll = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedRows(new Set(transactions.map(t => t.id)));
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

    const allRowsSelected = transactions.length > 0 && selectedRows.size === transactions.length;
    const someRowsSelected = selectedRows.size > 0 && selectedRows.size < transactions.length;

    const getCategory = (categoryName: string): Category | undefined => {
        return categories.find(c => c.name === categoryName);
    }

    const handleExport = () => {
        const headers = ["Date", "Description", "Member", "Merchant", "Category", "Amount", "Currency", "Status", "Report"];
        const csvRows = [
            headers.join(','),
            ...transactions.map(txn => {
                const row = [
                    `"${txn.date}"`,
                    `"${txn.description.replace(/"/g, '""')}"`,
                    `"${txn.member}"`,
                    `"${txn.merchant}"`,
                    `"${txn.category}"`,
                    txn.amount,
                    txn.currency,
                    `"${txn.status}"`,
                    `"${txn.report}"`,
                ];
                return row.join(',');
            })
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'expenses.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center justify-between p-4 sm:p-6">
                <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
                <div className="flex items-center gap-2">
                    <Button asChild className="bg-primary hover:bg-primary/90">
                        <Link href="/expenses/new">
                            <Plus className="mr-2 size-4" /> New expense
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon">
                        <Filter className="size-4" />
                    </Button>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={handleExport}>Export as CSV</DropdownMenuItem>
                            <DropdownMenuItem>Archive Selected</DropdownMenuItem>
                            <DropdownMenuItem>Delete Selected</DropdownMenuItem>
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
                                    <TableHead className="text-muted-foreground font-bold">MERCHANT</TableHead>
                                    <TableHead className="text-muted-foreground font-bold">AMOUNT</TableHead>
                                    <TableHead className="text-muted-foreground font-bold">EXPENSE REPORT</TableHead>
                                    <TableHead className="text-muted-foreground font-bold">STATUS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((txn) => {
                                    const category = getCategory(txn.category);
                                    const Icon = category?.icon;
                                    const color = category?.color;
                                    const member = members.find(m => m.name === txn.member);

                                    return (
                                        <TableRow key={txn.id} className="border-border/20 font-medium">
                                            <TableCell className="pl-4">
                                                <Checkbox
                                                    checked={selectedRows.has(txn.id)}
                                                    onCheckedChange={(checked) => handleSelectRow(txn.id, !!checked)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {Icon && color && (
                                                        <div
                                                        className="flex size-8 shrink-0 items-center justify-center rounded-md"
                                                        style={{ backgroundColor: color }}
                                                        >
                                                        <Icon className="size-4 text-white" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-semibold flex items-center gap-2">
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
                                                            {member ? (
                                                                <Link href={`/members/${member.id}`} className="hover:underline">
                                                                    {txn.member}
                                                                </Link>
                                                            ) : (
                                                                txn.member
                                                            )} &middot; {format(new Date(txn.date), 'MMM d, yyyy')}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{txn.merchant}</TableCell>
                                            <TableCell>{formatCurrency(txn.amount, txn.currency)}</TableCell>
                                            <TableCell>{txn.report}</TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant="outline"
                                                    className={cn("border-none rounded-md text-xs font-semibold py-1 px-2.5", 
                                                        txn.status === 'Submitted' && 'bg-violet-500/20 text-violet-400',
                                                        txn.status === 'Not Submitted' && 'bg-pink-500/20 text-pink-400'
                                                    )}
                                                >
                                                    {txn.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
