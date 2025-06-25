
"use client";

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SpendingCharts } from "@/components/spending-charts";
import type { Transaction, PendingTask } from "@/types";
import { CreditCard, Receipt, FileText, Plane } from "lucide-react";
import { useAppContext } from '@/context/app-provider';
import { cn } from '@/lib/utils';
import { CategorySpending } from "./category-spending";
import { DashboardSummary } from './dashboard-summary';
import { ActivitySidebar } from './activity-sidebar';

const quickAccessItems = [
  {
    label: "+ New expense",
    icon: CreditCard,
    color: "bg-pink-600 text-white",
  },
  {
    label: "+ Add receipt",
    icon: Receipt,
    color: "bg-blue-600 text-white",
  },
  {
    label: "+ Create report",
    icon: FileText,
    color: "bg-emerald-600 text-white",
  },
  {
    label: "+ Create trip",
    icon: Plane,
    color: "bg-red-600 text-white",
  },
]

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
        
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Monthly Report</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingCharts transactions={transactions} />
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        
        <Card className="bg-card flex flex-col">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent className='flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
              {quickAccessItems.map(item => (
                <Button key={item.label} variant="outline" className='h-16 justify-start p-4 bg-muted hover:bg-border/50'>
                  <div className={cn("mr-4 flex size-8 items-center justify-center rounded-md", item.color)}>
                      <item.icon className="size-4" />
                  </div>
                  <span className='font-semibold'>{item.label}</span>
                </Button>
              ))}
            </CardContent>
        </Card>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <ActivitySidebar />
        <CategorySpending />
      </div>
    </main>
  );
}
