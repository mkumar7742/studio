"use client";

import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SpendingCharts } from "@/components/spending-charts";
import type { Transaction, Budget, Category } from "@/types";
import { Plus, Receipt, FileText, Briefcase } from "lucide-react";
import { useAppContext } from '@/context/app-provider';
import { AddTransactionDialog } from './add-transaction-dialog';
import { Badge } from './ui/badge';

const CategoryIcon = ({ categoryName, categories }: { categoryName: string, categories: Category[] }) => {
  const category = categories.find((c) => c.name === categoryName);
  const Icon = category?.icon;
  return Icon ? (
    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
      <Icon className="size-4 text-muted-foreground" />
    </div>
  ) : null;
};

export function Dashboard() {
  const { transactions, budgets, categories } = useAppContext();

  const budgetStatus = useMemo(() => {
    return budgets.map(budget => {
      const spent = transactions
        .filter((t) => t.type === 'expense' && t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...budget, spent };
    })
  }, [budgets, transactions]);

  return (
    <main className="flex flex-col gap-6 p-4 md:p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>Your progress on monthly spending goals.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {budgetStatus.map(budget => (
              <div key={budget.category}>
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{budget.category}</span>
                  <span className='text-sm text-muted-foreground'>
                    ${(budget.allocated - budget.spent).toLocaleString()} left
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>A log of your recent income and expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.slice(0, 5).map((txn: Transaction) => (
                    <TableRow key={txn.id}>
                      <TableCell>
                        <div className="font-medium">{txn.description}</div>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs font-normal"
                          style={{
                            borderColor: categories.find(c => c.name === txn.category)?.color,
                            color: categories.find(c => c.name === txn.category)?.color
                          }}
                        >
                          {txn.category}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${txn.type === "income" ? "text-primary" : "text-foreground"}`}
                      >
                        {txn.type === "income" ? "+" : "-"}${txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <AddTransactionDialog />
          <Button variant="outline" className='h-20 flex-col gap-2'>
            <Receipt />
            Add Receipt
          </Button>
          <Button variant="outline" className='h-20 flex-col gap-2'>
            <FileText />
            Create Report
          </Button>
          <Button variant="outline" className='h-20 flex-col gap-2'>
            <Briefcase />
            New Budget
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Report</CardTitle>
          <CardDescription>Visualizing your financial habits over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingCharts transactions={transactions} />
        </CardContent>
      </Card>
    </main>
  );
}
