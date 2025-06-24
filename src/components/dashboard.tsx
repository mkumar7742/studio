"use client";

import { useMemo } from 'react';
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

const teamColors: { [key: string]: string } = {
  Marketing: "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50",
  Operations: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  Finance: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  default: "bg-muted text-muted-foreground border-border",
};

const quickAccessItems = [
  {
    label: "+ New expense",
    icon: CreditCard,
    color: "bg-pink-500/20 text-pink-400",
  },
  {
    label: "+ Add receipt",
    icon: Receipt,
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    label: "+ Create report",
    icon: FileText,
    color: "bg-emerald-500/20 text-emerald-400",
  },
  {
    label: "+ Create trip",
    icon: Plane,
    color: "bg-red-500/20 text-red-400",
  },
]

export function Dashboard() {
  const { transactions, pendingTasks } = useAppContext();

  const euroFormatter = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });

  return (
    <main className="flex-1 overflow-y-auto flex flex-col gap-6 p-4 md:p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 bg-card">
          <CardHeader>
            <CardTitle>Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {pendingTasks.map((task: PendingTask) => (
              <div key={task.label} className="flex items-center">
                <task.icon className="size-4 text-muted-foreground mr-4" />
                <span className="flex-grow text-sm">{task.label}</span>
                <span className="text-sm font-semibold">{task.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 bg-card">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Subject</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.slice(0, 5).map((txn: Transaction) => (
                    <TableRow key={txn.id} className="border-border">
                      <TableCell className="font-medium">{txn.description}</TableCell>
                      <TableCell>{txn.employee}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("border", teamColors[txn.team] || teamColors.default)}
                        >
                          {txn.team}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {euroFormatter.format(txn.amount)}
                      </TableCell>
                    </TableRow>
                  ))
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
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {quickAccessItems.map(item => (
            <Button key={item.label} variant="outline" className='h-16 justify-start p-4 bg-muted hover:bg-border/50'>
              <div className={cn("mr-4 flex size-8 items-center justify-center rounded-full", item.color)}>
                  <item.icon className="size-4" />
              </div>
              <span className='font-semibold'>{item.label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

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
