
import type { Account, Transaction, Category, Budget, PendingTask, Trip, Approval, MemberProfile, Role, Permission } from '@/types';
import { Wallet, CreditCard, Landmark, UtensilsCrossed, ShoppingCart, HeartPulse, Car, GraduationCap, Film, PiggyBank, Briefcase, Shapes, Plane, Receipt, Home, PenSquare, ClipboardCheck, CalendarClock, Undo2 } from 'lucide-react';

export const allPermissions: { group: string; permissions: { id: Permission; label: string }[] }[] = [
  {
    group: 'Dashboard',
    permissions: [{ id: 'dashboard:view', label: 'View Dashboard' }],
  },
  {
    group: 'Expenses',
    permissions: [
      { id: 'expenses:view', label: 'View Expenses' },
      { id: 'expenses:create', label: 'Create Expenses' },
      { id: 'expenses:edit', label: 'Edit Expenses' },
      { id: 'expenses:delete', label: 'Delete Expenses' },
    ],
  },
  {
    group: 'Trips',
    permissions: [
      { id: 'trips:view', label: 'View Trips' },
      { id: 'trips:create', label: 'Create Trips' },
    ],
  },
  {
    group: 'Approvals',
    permissions: [
      { id: 'approvals:view', label: 'View Approvals' },
      { id: 'approvals:action', label: 'Action Approvals' },
    ],
  },
  {
    group: 'Categories',
    permissions: [
      { id: 'categories:view', label: 'View Categories' },
      { id: 'categories:create', label: 'Create Categories' },
      { id: 'categories:edit', label: 'Edit Categories' },
      { id: 'categories:delete', label: 'Delete Categories' },
    ],
  },
  {
    group: 'Members',
    permissions: [
      { id: 'members:view', label: 'View Members' },
      { id: 'members:create', label: 'Create Members' },
      { id: 'members:edit', label: 'Edit Members' },
      { id: 'members:delete', label: 'Delete Members' },
    ],
  },
  {
    group: 'Roles',
    permissions: [{ id: 'roles:manage', label: 'Manage Roles & Permissions' }],
  },
];


export const roles: Role[] = [
  {
    id: 'role-admin',
    name: 'Administrator',
    permissions: [
      'dashboard:view',
      'expenses:view', 'expenses:create', 'expenses:edit', 'expenses:delete',
      'trips:view', 'trips:create',
      'approvals:view', 'approvals:action',
      'categories:view', 'categories:create', 'categories:edit', 'categories:delete',
      'members:view', 'members:create', 'members:edit', 'members:delete',
      'roles:manage',
    ],
  },
  {
    id: 'role-manager',
    name: 'Manager',
    permissions: [
      'dashboard:view',
      'expenses:view', 'expenses:create', 'expenses:edit',
      'trips:view', 'trips:create',
      'approvals:view', 'approvals:action',
      'categories:view',
      'members:view',
    ],
  },
  {
    id: 'role-member',
    name: 'Member',
    permissions: [
      'dashboard:view',
      'expenses:view', 'expenses:create',
      'trips:view', 'trips:create',
    ],
  },
];

export const members: MemberProfile[] = [
  { id: 'mem1', name: 'Janice Chandler', email: 'janice.chandler@example.com', roleId: 'role-admin', avatar: 'https://placehold.co/100x100.png', avatarHint: 'person portrait' },
  { id: 'mem2', name: 'John Doe', email: 'john.doe@example.com', roleId: 'role-manager', avatar: 'https://placehold.co/100x100.png', avatarHint: 'man portrait' },
  { id: 'mem3', name: 'Jane Smith', email: 'jane.smith@example.com', roleId: 'role-member', avatar: 'https://placehold.co/100x100.png', avatarHint: 'woman portrait' },
];

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
  { id: 'cat-9', name: 'Supplies', icon: PenSquare, color: 'hsl(206, 81%, 50%)' },
  { id: 'cat-10', name: 'Travel', icon: Plane, color: 'hsl(14, 88%, 58%)' },
  { id: 'cat-11', name: 'Accommodation', icon: Home, color: 'hsl(130, 71%, 48%)' },
  { id: 'cat-12', name: 'News Subscription', icon: Receipt, color: 'hsl(26, 88%, 58%)' },
  { id: 'cat-13', name: 'Software', icon: Shapes, color: 'hsl(250, 88%, 58%)' },
];

export const transactions: Transaction[] = [
  { id: 'txn1', type: 'expense', category: 'Food', description: 'Food Catering', amount: 250.00, date: '09/11/2022', accountId: 'acc3', receiptUrl: null, member: 'Janice Chandler', team: 'Marketing', merchant: 'McFood', report: 'November_2022', status: 'Not Submitted' },
  { id: 'txn2', type: 'expense', category: 'Supplies', description: 'Office Supplies', amount: 150.00, date: '10/11/2022', accountId: 'acc3', receiptUrl: null, member: 'John Doe', team: 'Operations', merchant: 'Officio', report: 'November_2022', status: 'Not Submitted' },
  { id: 'txn3', type: 'expense', category: 'Food', description: 'Business Lunch', amount: 75.50, date: '11/11/2022', accountId: 'acc1', receiptUrl: null, member: 'Jane Smith', team: 'Marketing', merchant: 'Restaurant', report: 'November_2022', status: 'Not Submitted' },
  { id: 'txn4', type: 'expense', category: 'Travel', description: 'Travel Expenses', amount: 450.25, date: '11/11/2022', accountId: 'acc3', receiptUrl: null, member: 'Janice Chandler', team: 'Finance', merchant: 'Airlines', report: 'November_2022', status: 'Submitted' },
  { id: 'txn5', type: 'expense', category: 'Food', description: 'Client Dinner', amount: 120.00, date: '12/11/2022', accountId: 'acc1', receiptUrl: null, member: 'John Doe', team: 'Marketing', merchant: 'Bistro', report: 'November_2022', status: 'Not Submitted' },
  { id: 'txn6', type: 'expense', category: 'Accommodation', description: 'Accommodation', amount: 275.75, date: '16/11/2022', accountId: 'acc1', receiptUrl: null, member: 'Jane Smith', team: 'Operations', merchant: 'Hotel ***', report: 'November_2022', status: 'Submitted' },
  { id: 'txn7', type: 'expense', category: 'News Subscription', description: 'News Subscription', amount: 30.00, date: '20/11/2022', accountId: 'acc3', receiptUrl: null, member: 'Janice Chandler', team: 'Finance', merchant: 'NewsTimes', report: 'November_2022', status: 'Not Submitted' },
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

export const trips: Trip[] = [
    { id: 'trip1', date: '08/11/2022', location: 'Copenhagen', purpose: 'Business Trip', amount: 1000.00, report: 'November_2022', status: 'Approved' },
    { id: 'trip2', date: '10/11/2022', location: 'London', purpose: 'Client Pitch', amount: 850.00, report: 'November_2022', status: 'Pending' },
    { id: 'trip3', date: '11/11/2022', location: 'Brussels', purpose: 'Client Pitch', amount: 1500.00, report: 'November_2022', status: 'Approved' },
    { id: 'trip4', date: '11/11/2022', location: 'Barcelona', purpose: 'Conference', amount: 2000.00, report: 'November_2022', status: 'Approved' },
    { id: 'trip5', date: '12/11/2022', location: 'Hamburg', purpose: 'Business Trip', amount: 980.00, report: 'November_2022', status: 'Not Approved' },
];

export const approvals: Approval[] = [
  { id: 'appr1', owner: { name: 'Samson Zap', title: 'Engineer', avatar: 'https://placehold.co/40x40.png', avatarHint: 'man portrait' }, category: 'Travel', amount: 780.00, frequency: 'Once', project: 'Client Design', description: "Travel to client's HQ for pitch presentation.", team: 'Websites', status: 'Pending' },
  { id: 'appr2', owner: { name: 'Jessica Bowers', title: 'Designer', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait' }, category: 'Travel', amount: 430.00, frequency: 'Once', project: 'Internal Workshop', description: 'Travel for company-wide design workshop.', team: 'Design', status: 'Pending' },
  { id: 'appr3', owner: { name: 'John Wilson', title: 'Account Executive', avatar: 'https://placehold.co/40x40.png', avatarHint: 'man portrait' }, category: 'Food', amount: 95.50, frequency: 'Monthly', project: 'Client Lunch', description: 'Monthly recurring client lunch.', team: 'Sales', status: 'Pending' },
  { id: 'appr4', owner: { name: 'Hannah Gomez', title: 'Product Manager', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait' }, category: 'Travel', amount: 560.00, frequency: 'Monthly', project: 'User Research', description: 'Travel for on-site user research.', team: 'Product', status: 'Pending' },
  { id: 'appr5', owner: { name: 'Laura Polis', title: 'Designer', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait' }, category: 'Software', amount: 120.00, frequency: 'Bi-Monthly', project: 'Design Tools', description: 'Subscription for new design software.', team: 'Design', status: 'Pending' },
  { id: 'appr6', owner: { name: 'Barbara Jones', title: 'Strategist', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait' }, category: 'Software', amount: 275.75, frequency: 'Bi-Monthly', project: 'Analytics Platform', description: 'Subscription for marketing analytics tool.', team: 'Marketing', status: 'Pending' },
  { id: 'appr7', owner: { name: 'Zach Moss', title: 'Engineer', avatar: 'https://placehold.co/40x40.png', avatarHint: 'man portrait' }, category: 'Travel', amount: 30.00, frequency: 'Monthly', project: 'Team Offsite', description: 'Monthly travel budget for team events.', team: 'Engineering', status: 'Pending' },
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
