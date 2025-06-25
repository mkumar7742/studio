
"use client";

import Link from 'next/link';
import {
  Card,
  CardContent,
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
import type { Transaction, PendingTask } from "@/types";
import { CreditCard, Receipt, FileText, Plane } from "lucide-react";
import { useAppContext } from '@/context/app-provider';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { CategorySpending } from "./category-spending";
import { DashboardSummary } from './dashboard-summary';

const teamColors: { [key: string]: string } = {
  Marketing: "bg-fuchsia-600 text-white",
  Operations: "bg-blue-600 text-white",
  Finance: "bg-emerald-600 text-white",
  default: "bg-muted text-muted-foreground",
};

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
  const { transactions, pendingTasks, categories, members } = useAppContext();

  const euroFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });

  const taskColorClasses: { [key: string]: string } = {
    'Pending Approvals': 'bg-pink-600',
    'New Trips Registered': 'bg-blue-600',
    'Unreported Expenses': 'bg-emerald-600',
    'Upcoming Expenses': 'bg-orange-500',
    'Unreported Advances': 'bg-purple-500',
  };


  return (
    <main className="flex-1 overflow-y-auto flex flex-col gap-6 p-4 md:p-6">
      <DashboardSummary />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 flex flex-col gap-6">
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
          <CategorySpending className="flex-1" />
        </div>
        
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Subject</TableHead>
                    <TableHead className="hidden sm:table-cell">Member</TableHead>
                    <TableHead className="hidden md:table-cell">Team</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.length > 0 ? (
                    transactions.slice(0, 5).map((txn: Transaction) => {
                      const category = categories.find(c => c.name === txn.category);
                      const Icon = category?.icon;
                      const color = category?.color;
                      const member = members.find(m => m.name === txn.member);

                      return (
                        <TableRow key={txn.id} className="border-border/50">
                           <TableCell>
                            <div className="flex items-center gap-3">
                              {Icon && color && (
                                <div
                                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-white"
                                  style={{ backgroundColor: color }}
                                >
                                  <Icon className="size-4" />
                                </div>
                              )}
                              <span className="font-medium">{txn.description}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                             {member ? (
                                <Link href={`/members/${member.id}`} className="hover:underline">
                                    {txn.member}
                                </Link>
                            ) : (
                                txn.member
                            )}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant="outline"
                              className={cn("border-none", teamColors[txn.team] || teamColors.default)}
                            >
                              {txn.team}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {euroFormatter.format(txn.amount)}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No expenses found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="bg-card flex flex-col">
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
            </CardHeader>
            <CardContent className='flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
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
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Monthly Report</CardTitle>
        </CardHeader>
        <CardContent>
          <SpendingCharts transactions={transactions} />
        </CardContent>
      </Card>
    </main>
  );
}
