import type { Account, Transaction, Category, Budget, PendingTask } from '@/types';
import { Wallet, CreditCard, Landmark, UtensilsCrossed, ShoppingCart, HeartPulse, Car, GraduationCap, Film, PiggyBank, Briefcase, Shapes, Clock, Plane, Receipt, CalendarClock, Undo2, Wrench, Home, PenSquare, ClipboardCheck } from 'lucide-react';

export const accounts: Account[] = [
  { id: 'acc1', name: 'Checking Account', balance: 4890.72, icon: Wallet },
  { id: 'acc2', name: 'Savings Account', balance: 12540.15, icon: PiggyBank },
  { id: 'acc3', name: 'Credit Card', balance: -784.21, icon: CreditCard },
];

export const categories: Category[] = [
  { id: 'cat-1', name: 'Income', icon: Briefcase, color: 'hsl(var(--chart-1))' },
  { id: 'cat-2', name: 'Rent', icon: Landmark, color: 'hsl(var(--chart-2))' },
  { id: 'cat-3', name: 'Food', icon: UtensilsCrossed, color: 'hsl(var(--chart-3))' },
  { id: 'cat-4', name: 'Shopping', icon: ShoppingCart, color: 'hsl(var(--chart-4))' },
  { id: 'cat-5', name: 'Health', icon: HeartPulse, color: 'hsl(var(--chart-5))' },
  { id: 'cat-6', name: 'Transport', icon: Car, color: 'hsl(var(--chart-1))' },
  { id: 'cat-7', name: 'Education', icon: GraduationCap, color: 'hsl(var(--chart-2))' },
  { id: 'cat-8', name: 'Entertainment', icon: Film, color: 'hsl(var(--chart-3))' },
  { id: 'cat-9', name: 'Supplies', icon: PenSquare, color: 'hsl(var(--chart-4))' },
  { id: 'cat-10', name: 'Travel', icon: Plane, color: 'hsl(var(--chart-5))' },
  { id: 'cat-11', name: 'Accommodation', icon: Home, color: 'hsl(var(--chart-1))' },
];

const today = new Date();
const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

export const transactions: Transaction[] = [
  { id: 'txn1', type: 'expense', category: 'Supplies', description: 'Office Supplies', amount: 150.00, date: formatDate(today), accountId: 'acc3', receiptUrl: null, employee: 'John Smith', team: 'Marketing' },
  { id: 'txn2', type: 'expense', category: 'Food', description: 'Business Lunch', amount: 75.50, date: formatDate(today), accountId: 'acc3', receiptUrl: null, employee: 'Sarah Jade', team: 'Marketing' },
  { id: 'txn3', type: 'expense', category: 'Travel', description: 'Travel Expenses', amount: 450.25, date: formatDate(today), accountId: 'acc1', receiptUrl: null, employee: 'Mike Brown', team: 'Operations' },
  { id: 'txn4', type: 'expense', category: 'Food', description: 'Client Dinner', amount: 120.00, date: formatDate(today), accountId: 'acc3', receiptUrl: null, employee: 'Jennifer Lee', team: 'Marketing' },
  { id: 'txn5', type: 'expense', category: 'Accommodation', description: 'Hotel', amount: 275.75, date: formatDate(today), accountId: 'acc1', receiptUrl: null, employee: 'David Wilson', team: 'Finance' },
];

export const budgets: Budget[] = [
    { category: 'Food', allocated: 500, spent: 203.10 },
    { category: 'Shopping', allocated: 300, spent: 89.99 },
    { category: 'Entertainment', allocated: 150, spent: 32.00 },
];

export const pendingTasks: PendingTask[] = [
  { icon: ClipboardCheck, label: 'Pending Approvals', value: 5, color: 'bg-pink-600' },
  { icon: Plane, label: 'New Trips Registered', value: 1, color: 'bg-blue-600' },
  { icon: Receipt, label: 'Unreported Expenses', value: 4, color: 'bg-emerald-600' },
  { icon: CalendarClock, label: 'Upcoming Expenses', value: 0, color: 'bg-orange-500' },
  { icon: Undo2, label: 'Unreported Advances', value: '€0.00', color: 'bg-purple-500' }
];

export const teamSpendingData = [
    { name: 'PJ', total: 80000 },
    { name: 'SJ', total: 35000 },
    { name: 'MB', total: 72000 },
    { name: 'IS', total: 65000 },
    { name: 'DW', total: 28000 },
    { name: 'ND', total: 55000 },
    { name: 'BS', total: 95000 },
];

export const dayToDayExpensesData = [
  { name: 'Accommodation', value: 45 },
  { name: 'Comms', value: 15 },
  { name: 'Services', value: 80 },
  { name: 'Food', value: 65 },
  { name: 'Fuel', value: 20 },
];
