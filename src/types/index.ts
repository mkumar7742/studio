
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
  member: string;
  team: string;
  merchant: string;
  report: string;
  status: 'Submitted' | 'Not Submitted';
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

export interface PendingTask {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: string;
}

export interface Trip {
  id: string;
  date: string;
  location: string;
  purpose: string;
  amount: number;
  report: string;
  status: 'Approved' | 'Pending' | 'Not Approved';
}

// A list of all possible permissions in the app
export type Permission =
  | 'dashboard:view'
  | 'expenses:view'
  | 'expenses:create'
  | 'expenses:edit'
  | 'expenses:delete'
  | 'trips:view'
  | 'trips:create'
  | 'approvals:view'
  | 'approvals:action'
  | 'categories:view'
  | 'categories:create'
  | 'categories:edit'
  | 'categories:delete'
  | 'members:view'
  | 'members:create'
  | 'members:edit'
  | 'members:delete'
  | 'roles:manage';

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  roleId: string;
  avatar: string;
  avatarHint: string;
}

export interface Approval {
  id: string;
  owner: {
    name: string;
    title: string;
    avatar: string;
    avatarHint: string;
  };
  category: 'Travel' | 'Food' | 'Software';
  amount: number;
  frequency: 'Once' | 'Monthly' | 'Bi-Monthly';
  project: string;
  description: string;
  team: string;
  status: 'Pending' | 'Approved' | 'Declined';
}
