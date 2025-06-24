"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-provider";
import { categories } from "@/lib/data";
import type { Transaction } from "@/types";

const CategoryIcon = ({ categoryName }: { categoryName: string }) => {
    const category = categories.find((c) => c.name === categoryName);
    const Icon = category?.icon;
    return Icon ? (
      <div className="flex size-8 items-center justify-center rounded-full bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
    ) : null;
};

export default function TransactionsPage() {
    const { transactions } = useAppContext();

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
                                <TableHead className="hidden md:table-cell">Category</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length > 0 ? (
                                transactions.map((txn: Transaction) => (
                                    <TableRow key={txn.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <CategoryIcon categoryName={txn.category} />
                                                <div className="font-medium">{txn.description}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{txn.date}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant="outline">{txn.category}</Badge>
                                        </TableCell>
                                        <TableCell
                                            className={`text-right font-medium ${
                                            txn.type === "income"
                                                ? "text-emerald-600"
                                                : "text-foreground"
                                            }`}
                                        >
                                            {txn.type === "income" ? "+" : "-"}${txn.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </TableCell>
                                    </TableRow>
                                ))
                                ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
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
