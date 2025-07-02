
import type { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: string; // yyyy-MM-dd
  receiptUrl: string | null;
  member: string;
  team?: string;
  merchant: string;
  report: string;
  status: 'Submitted' | 'Not Submitted' | 'Reimbursed' | 'Approved' | 'Declined';
  isRecurring?: boolean;
  recurrenceFrequency?: 'weekly' | 'monthly' | 'yearly';
  reimbursable?: boolean;
}

export interface Account {
  id:string;
  name: string;
  balance: number;
  currency: string;
  icon: LucideIcon;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  iconName: string;
  color: string;
  order: number;
}

export interface Budget {
    id: string;
    name: string;
    category: string;
    allocated: number;
    currency: string;
    scope: 'global' | 'member';
    memberId?: string;
    month: number; // 0-11
    year: number;
    status: 'active' | 'archived';
}

export interface PendingTask {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: string;
}

export interface Trip {
  id: string;
  departDate: string; // yyyy-MM-dd
  returnDate: string; // yyyy-MM-dd
  location: string;
  purpose: string;
  amount: number;
  currency: string;
  report: string;
  status: 'Approved' | 'Pending' | 'Not Approved';
  memberId: string;
  hotel?: string;
}

export interface Subscription {
  id: string;
  name: string;
  icon: LucideIcon;
  iconName: string;
  amount: number;
  currency: string;
  billingCycle: 'Monthly' | 'Yearly';
  nextPaymentDate: string; // yyyy-MM-dd
  category: string;
}

export type Permission =
  | 'dashboard:view'
  | 'expenses:view'
  | 'expenses:create'
  | 'expenses:edit'
  | 'expenses:delete'
  | 'income:view'
  | 'income:create'
  | 'income:edit'
  | 'income:delete'
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
  | 'roles:manage'
  | 'budgets:manage'
  | 'calendar:view'
  | 'subscriptions:view'
  | 'subscriptions:manage'
  | 'audit:view';

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

export interface MemberProfile {
  id: string;
  _id: string;
  name: string;
  email: string;
  roleId: string;
  avatar: string;
  avatarHint: string;
  phone?: string;
  address?: string;
  socials?: {
    platform: string;
    url: string;
  }[];
}

export interface Approval {
  id: string;
  _id: string;
  owner: {
    name: string;
    title: string;
    avatar: string;
    avatarHint: string;
  };
  category: 'Travel' | 'Food' | 'Software';
  amount: number;
  currency: string;
  frequency: 'Once' | 'Monthly' | 'Bi-Monthly';
  project: string;
  description: string;
  team: string;
  status: 'Pending' | 'Approved' | 'Declined';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Conversation {
  memberId: string; // The ID of the other member in the conversation
  messages: ChatMessage[];
  unreadCount?: number;
}

export interface AuditLog {
  id: string;
  _id: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  action: string;
  details: any;
}
