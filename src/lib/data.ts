import type { Account, Transaction, Category, Budget } from '@/types';
import { Wallet, CreditCard, Landmark, UtensilsCrossed, ShoppingCart, HeartPulse, Car, GraduationCap, Film, PiggyBank, Briefcase, TrendingUp } from 'lucide-react';

export const accounts: Account[] = [
  { id: 'acc1', name: 'Checking Account', balance: 4890.72, icon: Wallet },
  { id: 'acc2', name: 'Savings Account', balance: 12540.15, icon: PiggyBank },
  { id: 'acc3', name: 'Credit Card', balance: -784.21, icon: CreditCard },
];

export const categories: Category[] = [
  { name: 'Income', icon: Briefcase, color: 'hsl(var(--chart-1))' },
  { name: 'Rent', icon: Landmark, color: 'hsl(var(--chart-2))' },
  { name: 'Food', icon: UtensilsCrossed, color: 'hsl(var(--chart-3))' },
  { name: 'Shopping', icon: ShoppingCart, color: 'hsl(var(--chart-4))' },
  { name: 'Health', icon: HeartPulse, color: 'hsl(var(--chart-5))' },
  { name: 'Transport', icon: Car, color: 'hsl(var(--chart-1))' },
  { name: 'Education', icon: GraduationCap, color: 'hsl(var(--chart-2))' },
  { name: 'Entertainment', icon: Film, color: 'hsl(var(--chart-3))' },
  { name: 'Subscriptions', icon: TrendingUp, color: 'hsl(var(--chart-4))' },
];

const today = new Date();
const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

export const transactions: Transaction[] = [
  { id: 'txn1', type: 'income', category: 'Income', description: 'Monthly Salary', amount: 5500.00, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 1)), accountId: 'acc1', receiptUrl: null },
  { id: 'txn2', type: 'expense', category: 'Rent', description: 'Apartment Rent', amount: 1650.00, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 2)), accountId: 'acc1', receiptUrl: null },
  { id: 'txn3', type: 'expense', category: 'Food', description: 'Grocery Shopping', amount: 124.50, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 3)), accountId: 'acc1', receiptUrl: null },
  { id: 'txn4', type: 'expense', category: 'Transport', description: 'Gasoline', amount: 55.20, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 4)), accountId: 'acc1', receiptUrl: null },
  { id: 'txn5', type: 'expense', category: 'Entertainment', description: 'Movie Tickets', amount: 32.00, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 5)), accountId: 'acc3', receiptUrl: null },
  { id: 'txn6', type: 'expense', category: 'Shopping', description: 'New Shoes', amount: 89.99, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 6)), accountId: 'acc3', receiptUrl: null },
  { id: 'txn7', type: 'expense', category: 'Food', description: 'Restaurant Dinner', amount: 78.60, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 7)), accountId: 'acc3', receiptUrl: null },
  { id: 'txn8', type: 'expense', category: 'Health', description: 'Pharmacy', amount: 25.10, date: formatDate(new Date(today.getFullYear(), today.getMonth(), 8)), accountId: 'acc1', receiptUrl: null },
];

export const budgets: Budget[] = [
    { category: 'Food', allocated: 500, spent: 203.10 },
    { category: 'Shopping', allocated: 300, spent: 89.99 },
    { category: 'Entertainment', allocated: 150, spent: 32.00 },
];

export const monthlySpendingData = [
    { month: 'Jan', total: 2400 },
    { month: 'Feb', total: 2210 },
    { month: 'Mar', total: 2290 },
    { month: 'Apr', total: 2780 },
    { month: 'May', total: 1890 },
    { month: 'Jun', total: 2390 },
];
