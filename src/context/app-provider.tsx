
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import type { Transaction, Account, Category, Budget, PendingTask, Trip, Approval, MemberProfile, Role, Permission, Subscription, Conversation, ChatMessage } from '@/types';
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
import { addDays, format, isAfter, isBefore, parseISO } from 'date-fns';
import { Briefcase, Car, Film, GraduationCap, HeartPulse, Home, Landmark, PawPrint, Pizza, Plane, Receipt, Shapes, ShoppingCart, Sprout, UtensilsCrossed, Gift, Shirt, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, Clock, CalendarClock, Undo2, Repeat, Clapperboard, Music, Cloud, Sparkles } from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { convertToUsd, formatCurrency } from '@/lib/currency';

// Create a map of icon names to Lucide components
const iconMap: { [key: string]: LucideIcon } = {
    Briefcase, Landmark, UtensilsCrossed, ShoppingCart, HeartPulse, Car, GraduationCap, Film, Gift, Plane, Home, PawPrint, Receipt, Pizza, Shirt, Sprout, Shapes, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, Clock, CalendarClock, Undo2, Repeat, Clapperboard, Music, Cloud, Sparkles
};

export type FullTransaction = Omit<Transaction, 'id' | 'accountId' | 'team' | 'receiptUrl'>;
export type SubscriptionFormData = Omit<Subscription, 'id' | 'icon'> & { icon: string };
export type TripFormData = Omit<Trip, 'id' | 'status' | 'report'>;

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
    conversations: Conversation[];
    addTransaction: (values: FullTransaction) => void;
    deleteTransactions: (transactionIds: string[]) => void;
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
    updateApprovalStatus: (approvalId: string, status: 'Approved' | 'Declined') => void;
    addApproval: (values: Omit<Approval, 'id' | 'status' | 'owner'>) => void;
    addTrip: (trip: TripFormData) => void;
    editTrip: (tripId: string, values: Partial<Omit<Trip, 'id' | 'report' | 'memberId'>>) => void;
    deleteTrip: (tripId: string) => void;
    addSubscription: (values: SubscriptionFormData) => void;
    editSubscription: (subscriptionId: string, values: SubscriptionFormData) => void;
    deleteSubscription: (subscriptionId: string) => void;
    sendMessage: (receiverId: string, text: string) => void;
    markConversationAsRead: (memberId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// A static date to use for initial chat data to prevent hydration errors.
const staticBaseTime = new Date('2024-08-20T10:00:00.000Z').getTime();

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
    const [conversations, setConversations] = useState<Conversation[]>([
      {
        memberId: 'mem2', // John Doe
        unreadCount: 0,
        messages: [
          { id: 'msg1', senderId: 'mem1', text: 'Hey John, how is the project going?', timestamp: staticBaseTime - 1000 * 60 * 5 },
          { id: 'msg2', senderId: 'mem2', text: 'Hi Janice! Going well. Just wrapping up the Q3 report.', timestamp: staticBaseTime - 1000 * 60 * 4 },
          { id: 'msg3', senderId: 'mem1', text: 'Great to hear!', timestamp: staticBaseTime - 1000 * 60 * 3 },
        ]
      },
      {
        memberId: 'mem3', // Jane Smith
        unreadCount: 1,
        messages: [
          { id: 'msg4', senderId: 'mem3', text: 'Could you approve my expense for the flight to Brussels?', timestamp: staticBaseTime - 1000 * 60 * 20 },
        ]
      }
    ]);

    const currentUser = useMemo(() => members[0], [members]);

    const getMemberRole = useCallback((member: MemberProfile): Role | undefined => {
        return roles.find(r => r.id === member.roleId);
    }, [roles]);

    const currentUserRole = useMemo(() => getMemberRole(currentUser), [currentUser, getMemberRole]);
    const currentUserPermissions = useMemo(() => currentUserRole?.permissions ?? [], [currentUserRole]);
    const isPrivilegedUser = useMemo(() => {
        const roleName = currentUserRole?.name;
        return roleName === 'Administrator' || roleName === 'Manager';
    }, [currentUserRole]);

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

        const now = new Date();
        const next30Days = addDays(now, 30);
        const upcomingSubscriptionsCount = subscriptions.filter(s => {
            const paymentDate = parseISO(s.nextPaymentDate);
            return isAfter(paymentDate, now) && isBefore(paymentDate, next30Days);
        }).length;

        const pendingReimbursementsAmount = transactions
            .filter(t => t.reimbursable && t.status === 'Submitted')
            .reduce((sum, t) => sum + convertToUsd(t.amount, t.currency), 0);


        return [
            { icon: ClipboardCheck, label: 'Pending Approvals', value: visibleApprovals, color: 'bg-pink-600' },
            { icon: Plane, label: 'My Pending Trips', value: trips.filter(t => t.status === 'Pending').length, color: 'bg-blue-600' },
            { icon: Receipt, label: 'My Unsubmitted Expenses', value: unsubmittedCount, color: 'bg-emerald-600' },
            { icon: CalendarClock, label: 'Upcoming Bills & Subscriptions', value: upcomingSubscriptionsCount, color: 'bg-orange-500' },
            { icon: Undo2, label: 'Pending Reimbursements', value: formatCurrency(pendingReimbursementsAmount, 'USD'), color: 'bg-purple-500' }
        ].filter(task => task.value > 0 || (typeof task.value === 'string' && task.value !== formatCurrency(0, 'USD')));

    }, [transactions, trips, approvals, currentUserPermissions, subscriptions]);


    const addTransaction = useCallback((values: FullTransaction) => {
        const newTransaction: Transaction = {
            id: `txn-${Date.now()}`,
            ...values,
            accountId: accounts[0].id,
            team: 'Personal',
            receiptUrl: null,
        };
        setAllTransactions(prev => [newTransaction, ...prev]);
    }, [accounts]);

    const deleteTransactions = useCallback((transactionIds: string[]) => {
        setAllTransactions(prev => prev.filter(t => !transactionIds.includes(t.id)));
    }, []);

    const addBudget = useCallback((values: Omit<Budget, 'id' | 'status'>) => {
        const newBudget: Budget = {
            id: `bud-${Date.now()}`,
            ...values,
            status: 'active',
        };
        setAllBudgets(prev => [...prev, newBudget]);
    }, []);

    const editBudget = useCallback((budgetId: string, values: Omit<Budget, 'id'>) => {
        setAllBudgets(prev => prev.map(b => b.id === budgetId ? { id: budgetId, ...values } : b));
    }, []);

    const deleteBudget = useCallback((budgetId: string) => {
        setAllBudgets(prev => prev.filter(b => b.id !== budgetId));
    }, []);

    const archiveBudget = useCallback((budgetId: string, status: 'active' | 'archived') => {
        setAllBudgets(prev => prev.map(b => b.id === budgetId ? { ...b, status } : b));
    }, []);

    const addCategory = useCallback((values: { name: string; color: string; icon: string }) => {
        const newCategory: Category = {
            id: `cat-${Date.now()}`,
            name: values.name,
            color: values.color,
            icon: iconMap[values.icon] || Shapes,
        };
        setCategories(prev => [...prev, newCategory]);
    }, []);

    const editCategory = useCallback((categoryId: string, values: { name:string, color: string, icon: string }) => {
        setCategories(prev => prev.map(c => 
            c.id === categoryId 
            ? { ...c, name: values.name, color: values.color, icon: iconMap[values.icon] || Shapes } 
            : c));
    }, []);

    const deleteCategory = useCallback((categoryId: string) => {
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    }, []);

    const addMember = useCallback((values: { name: string; email: string; roleId: string; }) => {
        const newMember: MemberProfile = {
            id: `mem-${Date.now()}`,
            name: values.name,
            email: values.email,
            roleId: values.roleId,
            avatar: 'https://placehold.co/100x100.png',
            avatarHint: 'person portrait'
        };
        setMembers(prev => [...prev, newMember]);
    }, []);

    const editMember = useCallback((memberId: string, values: Partial<MemberProfile>) => {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...values } : m));
    }, []);
    
    const deleteMember = useCallback((memberId: string) => {
        setMembers(prev => prev.filter(m => m.id !== memberId));
    }, []);

    const addRole = useCallback((values: { name: string; permissions: Permission[] }) => {
        const newRole: Role = {
            id: `role-${Date.now()}`,
            name: values.name,
            permissions: values.permissions,
        };
        setRoles(prev => [...prev, newRole]);
    }, []);

    const editRole = useCallback((roleId: string, values: { name: string; permissions: Permission[] }) => {
        setRoles(prev => prev.map(r => r.id === roleId ? { ...r, ...values } : r));
    }, []);

    const deleteRole = useCallback((roleId: string) => {
        setRoles(prev => prev.filter(r => r.id !== roleId));
    }, []);

    const updateCurrentUser = useCallback((data: Partial<MemberProfile>) => {
        setMembers(prev => {
            const currentUserFromState = prev.find(m => m.id === currentUser.id);
            if (!currentUserFromState) return prev;

            const updatedUser = { ...currentUserFromState, ...data };
            
            return prev.map(m => m.id === currentUser.id ? updatedUser : m);
        });
    }, [currentUser.id]);

    const updateApprovalStatus = useCallback((approvalId: string, status: 'Approved' | 'Declined') => {
        setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status } : a));
    }, []);

    const addApproval = useCallback((values: Omit<Approval, 'id' | 'status' | 'owner'>) => {
        const role = getMemberRole(currentUser);
        const newApproval: Approval = {
            id: `appr-${Date.now()}`,
            ...values,
            status: 'Pending',
            owner: {
                name: currentUser.name,
                title: role?.name || 'Member',
                avatar: currentUser.avatar,
                avatarHint: currentUser.avatarHint,
            }
        };
        setApprovals(prev => [newApproval, ...prev]);
    }, [currentUser, getMemberRole]);

    const addTrip = useCallback((tripData: TripFormData) => {
        const newTrip: Trip = {
            id: `trip-${Date.now()}`,
            ...tripData,
            status: 'Pending',
            report: `${format(parseISO(tripData.departDate), 'MMMM_yyyy')}`
        };
        setAllTrips(prev => [...prev, newTrip]);
    }, []);

    const editTrip = useCallback((tripId: string, values: Partial<Omit<Trip, 'id' | 'report' | 'memberId'>>) => {
        setAllTrips(prev => prev.map(t => t.id === tripId ? { ...t, ...values } : t));
    }, []);

    const deleteTrip = useCallback((tripId: string) => {
        setAllTrips(prev => prev.filter(t => t.id !== tripId));
    }, []);
    
    const addSubscription = useCallback((values: SubscriptionFormData) => {
        const newSubscription: Subscription = {
            id: `sub-${Date.now()}`,
            ...values,
            icon: iconMap[values.icon] || Repeat,
        };
        setSubscriptions(prev => [...prev, newSubscription]);
    }, []);

    const editSubscription = useCallback((subscriptionId: string, values: SubscriptionFormData) => {
        setSubscriptions(prev => prev.map(s => 
            s.id === subscriptionId 
            ? { id: subscriptionId, ...values, icon: iconMap[values.icon] || Repeat } 
            : s
        ));
    }, []);

    const deleteSubscription = useCallback((subscriptionId: string) => {
        setSubscriptions(prev => prev.filter(s => s.id !== subscriptionId));
    }, []);

    const markConversationAsRead = useCallback((memberId: string) => {
        setConversations(prev => prev.map(c => 
            c.memberId === memberId ? { ...c, unreadCount: 0 } : c
        ));
    }, []);
    
    const sendMessage = useCallback((receiverId: string, text: string) => {
        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            senderId: currentUser.id,
            text,
            timestamp: Date.now(),
        };

        setConversations(prev => {
            const conversationExists = prev.some(c => c.memberId === receiverId);
            if (conversationExists) {
                return prev.map(c => 
                    c.memberId === receiverId
                        ? { ...c, messages: [...c.messages, newMessage] }
                        : c
                );
            } else {
                const newConversation: Conversation = {
                    memberId: receiverId,
                    messages: [newMessage],
                    unreadCount: 0,
                };
                return [...prev, newConversation];
            }
        });

        // Simulate a reply after a short delay to demonstrate unread count
        setTimeout(() => {
            const receiver = members.find(m => m.id === receiverId);
            const replyText = `This is an automated reply from ${receiver?.name || 'a member'}. Got your message!`;

            const replyMessage: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                senderId: receiverId,
                text: replyText,
                timestamp: Date.now(),
            };

            setConversations(prev => prev.map(c => 
                c.memberId === receiverId
                    ? { 
                        ...c, 
                        messages: [...c.messages, replyMessage],
                        unreadCount: (c.unreadCount || 0) + 1,
                      }
                    : c
            ));
        }, 2500);
    }, [currentUser.id, members]);

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
        conversations,
        addTransaction,
        deleteTransactions,
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
        updateCurrentUser,
        updateApprovalStatus,
        addApproval,
        addTrip,
        editTrip,
        deleteTrip,
        addSubscription,
        editSubscription,
        deleteSubscription,
        sendMessage,
        markConversationAsRead,
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
