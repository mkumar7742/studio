
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
import { Progress } from "@/components/ui/progress";
import { AIFinancialInsights } from "@/components/ai-financial-insights";
import { SpendingCharts } from "@/components/spending-charts";
import type { Account, Transaction, Budget, Category } from "@/types";
import { MoreHorizontal, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAppContext } from '@/context/app-provider';

const CategoryIcon = ({ categoryName, categories }: { categoryName: string, categories: Category[] }) => {
  const category = categories.find((c) => c.name === categoryName);
  const Icon = category?.icon;
  return Icon ? (
    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
      <Icon className="size-4 text-muted-foreground" />
    </div>
  ) : null;
};

const BudgetCard = ({ budget, transactions }: { budget: Budget, transactions: Transaction[] }) => {
  const spent = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense' && t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, budget.category]);

  const progress = (spent / budget.allocated) * 100;
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="text-sm font-medium">{budget.category}</span>
        <span className="text-sm text-muted-foreground">
          ${spent.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} / ${budget.allocated.toLocaleString()}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export function Dashboard() {
  const { transactions, accounts, budgets, categories } = useAppContext();

  const { totalBalance, totalIncome, totalExpenses } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return { totalBalance: balance, totalIncome: income, totalExpenses: expenses };
  }, [transactions, accounts]);

  return (
    <main className="grid gap-4 p-4 sm:p-6 md:gap-6 lg:grid-cols-3">
      <div className="grid auto-rows-max gap-4 md:gap-6 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">Across all accounts</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Income this month</CardTitle>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">+${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                     <p className="text-xs text-muted-foreground">Total earnings</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Expenses this month</CardTitle>
                    <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">Total spending</p>
                </CardContent>
            </Card>
        </div>

        <SpendingCharts transactions={transactions} />

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              A log of your recent income and expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.slice(0, 5).map((txn: Transaction) => (
                    <TableRow key={txn.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <CategoryIcon categoryName={txn.category} categories={categories} />
                          <div>
                            <p className="font-medium">{txn.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {txn.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{txn.date}</TableCell>
                      <TableCell
                        className={`text-right font-medium ${
                          txn.type === "income"
                            ? "text-emerald-600"
                            : "text-foreground"
                        }`}
                      >
                        {txn.type === "income" ? "+" : "-"}${txn.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                        </Button>
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
      </div>

      <div className="grid auto-rows-max gap-4 md:gap-6 lg:col-span-1">
        <Card>
            <CardHeader>
                <CardTitle>Your Accounts</CardTitle>
                <CardDescription>A summary of your connected accounts.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {accounts.map(account => {
                    const AccountIcon = account.icon;
                    return (
                        <div key={account.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                                    <AccountIcon className="size-4 text-muted-foreground" />
                                </div>
                                <span className="font-medium">{account.name}</span>
                            </div>
                            <div className={`font-semibold ${account.balance < 0 ? 'text-destructive' : 'text-foreground'}`}>
                                ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                        </div>
                    )
                })}
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>
              Your spending vs. your monthly goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {budgets.map((b) => (
              <BudgetCard key={b.category} budget={b} transactions={transactions} />
            ))}
          </CardContent>
        </Card>

        <AIFinancialInsights />
      </div>
    </main>
  );
}
