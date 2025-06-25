
"use client";

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SpendingCharts } from "@/components/spending-charts";
import type { PendingTask } from "@/types";
import { useAppContext } from '@/context/app-provider';
import { cn } from '@/lib/utils';
import { CategorySpending } from "./category-spending";
import { DashboardSummary } from './dashboard-summary';
import { ActivitySidebar } from './activity-sidebar';
import { BudgetsOverview } from './budgets-overview';
import { CreditCard, Plane, TrendingUp, ClipboardCheck } from 'lucide-react';

export function Dashboard() {
  const { transactions: allTransactions, pendingTasks } = useAppContext();
  const transactions = allTransactions.filter(t => t.type === 'expense');

  const taskLinks: { [key: string]: string } = {
    'Pending Approvals': '/approvals',
    'New Trips Registered': '/trips',
    'Unsubmitted Expenses': '/expenses',
    'Upcoming Bills & Subscriptions': '/subscriptions',
    'Pending Reimbursements': '/expenses',
  };


  return (
    <main className="grid flex-1 grid-cols-1 gap-6 p-4 md:p-6 lg:grid-cols-4">
      {/* Main Content */}
      <div className="flex flex-col gap-6 lg:col-span-3">
        <DashboardSummary />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="bg-card lg:col-span-2">
                <CardHeader>
                    <CardTitle>Monthly Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <SpendingCharts transactions={transactions} />
                </CardContent>
            </Card>
            <CategorySpending />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BudgetsOverview />
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {pendingTasks.map((task: PendingTask) => {
                    const link = taskLinks[task.label] || '#';
                    return (
                      <Link href={link} key={task.label} className="block group">
                        <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80 flex flex-col justify-between">
                          <div className="flex items-start justify-between">
                            <p className="font-semibold text-foreground/90">{task.label}</p>
                            <div className={cn("flex size-8 items-center justify-center rounded-lg text-white", task.color)}>
                              <task.icon className="size-4" />
                            </div>
                          </div>
                          <p className="mt-4 text-3xl font-bold text-foreground">{task.value}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Quick Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link href="/expenses/new" className="block group">
                        <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80">
                        <CreditCard className="size-8 text-red-500 mb-2" />
                        <h3 className="font-semibold">New Expense</h3>
                        <p className="text-sm text-muted-foreground">Quickly add a new expense.</p>
                        </div>
                    </Link>
                    <Link href="/income/new" className="block group">
                        <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80">
                        <TrendingUp className="size-8 text-green-500 mb-2" />
                        <h3 className="font-semibold">New Income</h3>
                        <p className="text-sm text-muted-foreground">Record a new source of income.</p>
                        </div>
                    </Link>
                    <Link href="/trips/new" className="block group">
                        <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80">
                        <Plane className="size-8 text-blue-500 mb-2" />
                        <h3 className="font-semibold">New Trip</h3>
                        <p className="text-sm text-muted-foreground">Plan and budget a new trip.</p>
                        </div>
                    </Link>
                    <Link href="/approvals/new" className="block group">
                        <div className="h-full rounded-lg bg-muted/50 p-4 transition-colors group-hover:bg-accent/80">
                        <ClipboardCheck className="size-8 text-pink-500 mb-2" />
                        <h3 className="font-semibold">New Approval</h3>
                        <p className="text-sm text-muted-foreground">Submit a new request for approval.</p>
                        </div>
                    </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
        
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-1">
        <ActivitySidebar />
      </div>
    </main>
  );
}
