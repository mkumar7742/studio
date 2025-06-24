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
import { accounts, transactions, categories, budgets } from "@/lib/data";
import { AIFinancialInsights } from "@/components/ai-financial-insights";
import { SpendingCharts } from "@/components/spending-charts";
import type { Account, Transaction, Budget } from "@/types";
import { MoreHorizontal } from "lucide-react";

const CategoryIcon = ({ categoryName }: { categoryName: string }) => {
  const category = categories.find((c) => c.name === categoryName);
  const Icon = category?.icon;
  return Icon ? (
    <div className="flex size-8 items-center justify-center rounded-full bg-muted">
      <Icon className="size-4 text-muted-foreground" />
    </div>
  ) : null;
};

const AccountCard = ({ account }: { account: Account }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
      <account.icon className="size-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">${account.balance.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">
        {account.id === "acc3" ? "Remaining Credit" : "Available Balance"}
      </p>
    </CardContent>
  </Card>
);

const BudgetCard = ({ budget }: { budget: Budget }) => {
  const progress = (budget.spent / budget.allocated) * 100;
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="text-sm font-medium">{budget.category}</span>
        <span className="text-sm text-muted-foreground">
          ${budget.spent.toLocaleString()} / ${budget.allocated.toLocaleString()}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export function Dashboard() {
  return (
    <main className="grid gap-4 p-4 sm:p-6 md:gap-6 lg:grid-cols-3">
      <div className="grid gap-4 md:gap-6 lg:col-span-2">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {accounts.map((acc) => (
            <AccountCard key={acc.id} account={acc} />
          ))}
        </div>

        <SpendingCharts />

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
                {transactions.map((txn: Transaction) => (
                  <TableRow key={txn.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <CategoryIcon categoryName={txn.category} />
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
                          ? "text-green-600"
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-6 lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Budget Status</CardTitle>
            <CardDescription>
              Your spending vs. your monthly goals.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {budgets.map((b) => (
              <BudgetCard key={b.category} budget={b} />
            ))}
          </CardContent>
        </Card>

        <AIFinancialInsights />
      </div>
    </main>
  );
}
