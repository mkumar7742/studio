
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
  status: 'Submitted' | 'Not Submitted' | 'Reimbursed';
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

export interface PendingTask {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: string;
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
  | 'categories:view'
  | 'categories:create'
  | 'categories:edit'
  | 'categories:delete'
  | 'members:view'
  | 'members:create'
  | 'members:edit'
  | 'members:delete'
  | 'roles:manage'
  | 'calendar:view'
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
  permissions?: Permission[];
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
