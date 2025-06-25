
"use client";

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

  const taskColorClasses: { [key: string]: string } = {
    'Pending Approvals': 'bg-pink-600',
    'New Trips Registered': 'bg-blue-600',
    'Unreported Expenses': 'bg-emerald-600',
    'Upcoming Expenses': 'bg-orange-500',
    'Unreported Advances': 'bg-purple-500',
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
          <CardContent className='space-y-4'>
            {pendingTasks.map((task: PendingTask) => (
              <div key={task.label} className="flex items-center">
                <div className={cn("mr-4 flex size-8 items-center justify-center rounded-md text-white", taskColorClasses[task.label] || 'bg-gray-500')}>
                    <task.icon className="size-4" />
                </div>
                <span className="flex-grow text-sm">{task.label}</span>
                <span className="text-sm font-semibold">{task.value}</span>
              </div>
            ))}
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
