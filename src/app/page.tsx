"use client";

import { useState } from 'react';
import { Dashboard } from "@/components/dashboard";
import { PageHeader } from "@/components/page-header";
import { transactions as initialTransactions } from "@/lib/data";
import type { Transaction } from '@/types';
import type { AddTransactionValues } from '@/components/add-transaction-form';
import { format } from "date-fns";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addTransaction = (values: AddTransactionValues) => {
    const newTransaction: Transaction = {
        id: `txn-${Date.now()}`,
        ...values,
        date: format(values.date, "MMMM d"),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Dashboard"
        description="Welcome back, here's your financial overview."
        showAddTransaction
        onAddTransaction={addTransaction}
        />
      <div className="flex-1 overflow-y-auto">
        <Dashboard transactions={transactions} />
      </div>
    </div>
  );
}
