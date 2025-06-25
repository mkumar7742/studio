
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { Transaction, Account, Category, Budget, PendingTask, Trip, Approval, MemberProfile, Role, Permission, Subscription } from '@/types';
import {
    accounts as initialAccounts,
    categories as initialCategories,
    transactions as initialTransactions,
    budgets as initialBudgets,
    trips as initialTrips,
    approvals as initialApprovals,
    members as initialMembers,
    roles as initialRoles,
    allPermissions,
    subscriptions as initialSubscriptions,
} from '@/lib/data';
import type { AddTransactionValues } from '@/components/add-transaction-form';
import { format } from 'date-fns';
import { Briefcase, Car, Film, GraduationCap, HeartPulse, Home, Landmark, PawPrint, Pizza, Plane, Receipt, Shapes, ShoppingCart, Sprout, UtensilsCrossed, Gift, Shirt, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, Clock, CalendarClock, Undo2 } from "lucide-react";
import type { LucideIcon } from 'lucide-react';

// Create a map of icon names to Lucide components
const iconMap: { [key: string]: LucideIcon } = {
    Briefcase, Landmark, UtensilsCrossed, ShoppingCart, HeartPulse, Car, GraduationCap, Film, Gift, Plane, Home, PawPrint, Receipt, Pizza, Shirt, Sprout, Shapes, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, Clock, CalendarClock, Undo2
};

interface AppContextType {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    budgets: Budget[];
    pendingTasks: PendingTask[];
    trips: Trip[];
    approvals: Approval[];
    members: MemberProfile[];
    roles: Role[];
    subscriptions: Subscription[];
    allPermissions: typeof allPermissions;
    currentUser: MemberProfile;
    currentUserPermissions: Permission[];
    addTransaction: (values: AddTransactionValues) => void;
    addBudget: (values: Omit<Budget, 'id' | 'status'>) => void;
    editBudget: (budgetId: string, values: Omit<Budget, 'id'>) => void;
    deleteBudget: (budgetId: string) => void;
    archiveBudget: (budgetId: string, status: 'active' | 'archived') => void;
    addCategory: (values: { name: string; color: string; icon: string }) => void;
    editCategory: (categoryId: string, values: { name: string; color: string; icon: string }) => void;
    deleteCategory: (categoryId: string) => void;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    addMember: (values: { name: string; email: string; roleId: string; }) => void;
    editMember: (memberId: string, values: Partial<MemberProfile>) => void;
    deleteMember: (memberId: string) => void;
    getMemberRole: (member: MemberProfile) => Role | undefined;
    addRole: (values: { name: string; permissions: Permission[] }) => void;
    editRole: (roleId: string, values: { name: string; permissions: Permission[] }) => void;
    deleteRole: (roleId: string) => void;
    updateCurrentUser: (data: Partial<MemberProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>(initialTransactions);
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [allBudgets, setAllBudgets] = useState<Budget[]>(initialBudgets);
    const [allTrips, setAllTrips] = useState<Trip[]>(initialTrips);
    const [approvals, setApprovals] = useState<Approval[]>(initialApprovals);
    const [members, setMembers] = useState<MemberProfile[]>(initialMembers);
    const [roles, setRoles] = useState<Role[]>(initialRoles);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(initialSubscriptions);

    // For demonstration purposes, we assume the logged-in user is the first member.
    // In a real app, this would come from an authentication provider.
    const currentUser = useMemo(() => members[0], [members]);

    const getMemberRole = (member: MemberProfile): Role | undefined => {
        return roles.find(r => r.id === member.roleId);
    };

    const currentUserRole = useMemo(() => getMemberRole(currentUser), [currentUser, roles]);
    const currentUserPermissions = useMemo(() => currentUserRole?.permissions ?? [], [currentUserRole]);
    const isPrivilegedUser = useMemo(() => {
        const roleName = currentUserRole?.name;
        return roleName === 'Administrator' || roleName === 'Manager';
    }, [currentUserRole]);

    // Filter data based on user role
    const transactions = useMemo(() => {
        if (isPrivilegedUser) return allTransactions;
        return allTransactions.filter(t => t.member === currentUser.name);
    }, [allTransactions, currentUser.name, isPrivilegedUser]);

    const budgets = useMemo(() => {
        if (isPrivilegedUser) return allBudgets;
        return allBudgets.filter(b => b.scope === 'global' || b.memberId === currentUser.id);
    }, [allBudgets, currentUser.id, isPrivilegedUser]);

    const trips = useMemo(() => {
        if (isPrivilegedUser) return allTrips;
        return allTrips.filter(t => t.memberId === currentUser.id);
    }, [allTrips, currentUser.id, isPrivilegedUser]);
    
    const pendingTasks = useMemo(() => {
        const unsubmittedCount = transactions.filter(t => t.status === 'Not Submitted').length;
        const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;
        
        let visibleApprovals = 0;
        if(currentUserPermissions.includes('approvals:action')) {
            visibleApprovals = pendingApprovalsCount;
        }

        return [
            { icon: ClipboardCheck, label: 'Pending Approvals', value: visibleApprovals, color: 'bg-pink-600' },
            { icon: Plane, label: 'My Pending Trips', value: trips.filter(t => t.status === 'Pending').length, color: 'bg-blue-600' },
            { icon: Receipt, label: 'My Unsubmitted Expenses', value: unsubmittedCount, color: 'bg-emerald-600' },
            { icon: CalendarClock, label: 'Upcoming Bills & Subscriptions', value: 0, color: 'bg-orange-500' },
            { icon: Undo2, label: 'Pending Reimbursements', value: '$0.00', color: 'bg-purple-500' }
        ].filter(task => task.value > 0 || task.label === 'Pending Reimbursements' || task.label === 'Upcoming Bills & Subscriptions' );

    }, [transactions, trips, approvals, currentUserPermissions]);


    const addTransaction = (values: AddTransactionValues) => {
        const newTransaction: Transaction = {
            id: `txn-${Date.now()}`,
            type: values.type,
            description: values.description,
            amount: values.amount,
            currency: values.currency,
            category: values.category,
            accountId: values.accountId,
            date: format(values.date, "yyyy-MM-dd"),
            receiptUrl: values.receipt ? URL.createObjectURL(values.receipt) : null,
            member: values.member,
            team: 'Personal',
            merchant: 'N/A',
            report: 'N/A',
            status: 'Not Submitted',
            isRecurring: values.isRecurring,
            recurrenceFrequency: values.isRecurring ? values.recurrenceFrequency : undefined,
        };
        setAllTransactions(prev => [newTransaction, ...prev]);
    };

    const addBudget = (values: Omit<Budget, 'id' | 'status'>) => {
        const newBudget: Budget = {
            id: `bud-${Date.now()}`,
            ...values,
            status: 'active',
        };
        setAllBudgets(prev => [...prev, newBudget]);
    }

    const editBudget = (budgetId: string, values: Omit<Budget, 'id'>) => {
        setAllBudgets(prev => prev.map(b => b.id === budgetId ? { id: budgetId, ...values } : b));
    };

    const deleteBudget = (budgetId: string) => {
        setAllBudgets(prev => prev.filter(b => b.id !== budgetId));
    };

    const archiveBudget = (budgetId: string, status: 'active' | 'archived') => {
        setAllBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, status } : b));
    };

    const addCategory = (values: { name: string; color: string; icon: string }) => {
        const newCategory: Category = {
            id: `cat-${Date.now()}`,
            name: values.name,
            color: values.color,
            icon: iconMap[values.icon] || Shapes,
        };
        setCategories(prev => [...prev, newCategory]);
    };

    const editCategory = (categoryId: string, values: { name:string, color: string, icon: string }) => {
        setCategories(prev => prev.map(c => 
            c.id === categoryId 
            ? { ...c, name: values.name, color: values.color, icon: iconMap[values.icon] || Shapes } 
            : c));
    }

    const deleteCategory = (categoryId: string) => {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    };

    const addMember = (values: { name: string; email: string; roleId: string; }) => {
        const newMember: MemberProfile = {
            id: `mem-${Date.now()}`,
            name: values.name,
            email: values.email,
            roleId: values.roleId,
            avatar: 'https://placehold.co/100x100.png',
            avatarHint: 'person portrait'
        };
        setMembers(prev => [...prev, newMember]);
    };

    const editMember = (memberId: string, values: Partial<MemberProfile>) => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...values } : m));
    };
    
    const deleteMember = (memberId: string) => {
        setMembers(prev => prev.filter(m => m.id !== memberId));
    };

    const addRole = (values: { name: string; permissions: Permission[] }) => {
        const newRole: Role = {
            id: `role-${Date.now()}`,
            name: values.name,
            permissions: values.permissions,
        };
        setRoles(prev => [...prev, newRole]);
    };

    const editRole = (roleId: string, values: { name: string; permissions: Permission[] }) => {
        setRoles(prev => prev.map(r => r.id === roleId ? { ...r, ...values } : r));
    };

    const deleteRole = (roleId: string) => {
        setRoles(prev => prev.filter(r => r.id !== roleId));
    };

    const updateCurrentUser = (data: Partial<MemberProfile>) => {
        setMembers(prev => {
            const currentUserFromState = prev.find(m => m.id === currentUser.id);
            if (!currentUserFromState) return prev;

            const updatedUser = { ...currentUserFromState, ...data };
            
            return prev.map(m => m.id === currentUser.id ? updatedUser : m);
        });
    };

    const value = {
        transactions,
        accounts,
        categories,
        budgets,
        pendingTasks,
        trips,
        approvals,
        members,
        roles,
        subscriptions,
        allPermissions,
        currentUser,
        currentUserPermissions,
        addTransaction,
        addBudget,
        editBudget,
        deleteBudget,
        archiveBudget,
        addCategory,
        editCategory,
        deleteCategory,
        setCategories,
        addMember,
        editMember,
        deleteMember,
        getMemberRole,
        addRole,
        editRole,
        deleteRole,
        updateCurrentUser
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
