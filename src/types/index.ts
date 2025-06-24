import type { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  accountId: string;
  receiptUrl: string | null;
}

export interface Account {
  id:string;
  name: string;
  balance: number;
  icon: LucideIcon;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export interface Budget {
    category: string;
    allocated: number;
    spent: number;
}
