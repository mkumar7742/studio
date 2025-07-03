
import type { LucideIcon } from 'lucide-react';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: string; // yyyy-MM-dd
  member: string;
  merchant: string;
  isRecurring?: boolean;
  recurrenceFrequency?: 'weekly' | 'monthly' | 'yearly';
  familyId: string;
}

export interface Account {
  id:string;
  name: string;
  balance: number;
  currency: string;
  icon: LucideIcon;
  familyId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  iconName: string;
  color: string;
  order: number;
  familyId: string;
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
  | 'approvals:request'
  | 'approvals:manage'
  | 'budgets:view'
  | 'budgets:manage'
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
  familyId: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  email: string;
  roleId: string;
  familyId: string;
  avatar: string;
  avatarHint: string;
  phone?: string;
  address?: string;
  bio?: string;
  socials?: {
    platform: string;
    url: string;
  }[];
  permissions?: Permission[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

export interface Conversation {
  memberId: string; // The ID of the other member in the conversation
  messages: ChatMessage[];
  unreadCount?: number;
}

export interface AuditLog {
  _id: string;
  timestamp: string;
  memberId: string;
  memberName: string;
  action: string;
  details: any;
  familyId: string;
}

export interface Approval {
  id: string;
  memberId: string;
  memberName: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  decisionDate?: string;
  approverId?: string;
  approverName?: string;
  notes?: string;
  familyId: string;
}

export interface Budget {
    id: string;
    familyId: string;
    categoryId: string;
    categoryName: string;
    amount: number;
    period: 'monthly' | 'yearly';
}
