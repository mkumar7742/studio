
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/context/app-provider';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { Transaction } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

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

export default function CategoryDetailPage() {
    const params = useParams();
    const { id } = params as { id: string };
    const { categories, transactions } = useAppContext();

    const category = categories.find(c => c.id === id);
    const categoryTransactions = transactions.filter(t => t.category === category?.name);

    if (!category) {
        return (
            <div className="flex flex-col h-full">
                <PageHeader title="Category Not Found" description="Could not find the requested category." />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <p>The category you are looking for does not exist.</p>
                     <Button asChild variant="outline" className="mt-4">
                        <Link href="/categories">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to Categories
                        </Link>
                    </Button>
                </main>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <PageHeader title={`Category: ${category.name}`} description={`Transactions for the "${category.name}" category.`} />
            <main className="flex-1 overflow-y-auto">
                 <div className="px-4 sm:px-6 mb-4">
                     <Button asChild variant="outline">
                        <Link href="/categories">
                            <ArrowLeft className="mr-2 size-4" />
                            Back to All Categories
                        </Link>
                    </Button>
                </div>
                <Card className="m-4 sm:m-6 mt-0">
                    <CardHeader>
                        <CardTitle>Transactions ({categoryTransactions.length})</CardTitle>
                        <CardDescription>A log of your transactions in this category.</CardDescription>
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
                                {categoryTransactions.length > 0 ? (
                                categoryTransactions.map((txn: Transaction) => (
                                    <TableRow key={txn.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <CategoryIcon categoryName={txn.category} />
                                                <div>
                                                    <div className="font-medium">{txn.description}</div>
                                                    <div className="text-sm text-muted-foreground">{txn.category} &middot; {txn.member}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{format(new Date(txn.date), 'PPP')}</TableCell>
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
                                    <TableCell colSpan={3} className="h-24 text-center">
                                    No transactions found for this category.
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
