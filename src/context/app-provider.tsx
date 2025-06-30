
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Transaction, Account, Category, Budget, PendingTask, Trip, Approval, MemberProfile, Role, Permission, Subscription, Conversation, ChatMessage } from '@/types';
import { addDays, format, isAfter, isBefore, parseISO } from 'date-fns';
import { Briefcase, Car, Film, GraduationCap, HeartPulse, Home, Landmark, PawPrint, Pizza, Plane, Receipt, Shapes, ShoppingCart, Sprout, UtensilsCrossed, Gift, Shirt, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, Clock, CalendarClock, Undo2, Repeat, Clapperboard, Music, Cloud, Sparkles, CreditCard, PiggyBank, Wallet } from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { convertToUsd, formatCurrency } from '@/lib/currency';
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = 'http://localhost:5001/api';

let apiHeaders = { 'Content-Type': 'application/json' };

const iconMap: { [key: string]: LucideIcon } = {
    Briefcase, Landmark, UtensilsCrossed, ShoppingCart, HeartPulse, Car, GraduationCap, Film, Gift, Plane, Home, PawPrint, Receipt, Pizza, Shirt, Sprout, Shapes, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, Clock, CalendarClock, Undo2, Repeat, Clapperboard, Music, Cloud, Sparkles, CreditCard, PiggyBank, Wallet
};

export type FullTransaction = Omit<Transaction, 'id' | 'accountId' | 'team' | 'receiptUrl'>;
export type SubscriptionFormData = Omit<Subscription, 'id' | 'icon' | 'iconName'> & { iconName: string };
export type TripFormData = Omit<Trip, 'id' | 'status' | 'report'>;

interface AppContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
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
    allPermissions: { group: string; permissions: { id: Permission; label: string }[] }[];
    currentUser: MemberProfile | null;
    currentUserPermissions: Permission[];
    conversations: Conversation[];
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    addTransaction: (values: Omit<Transaction, 'id'>) => Promise<void>;
    deleteTransactions: (transactionIds: string[]) => Promise<void>;
    addBudget: (values: Omit<Budget, 'id' | 'status'>) => Promise<void>;
    editBudget: (budgetId: string, values: Omit<Budget, 'id'>) => Promise<void>;
    deleteBudget: (budgetId: string) => Promise<void>;
    archiveBudget: (budgetId: string, status: 'active' | 'archived') => Promise<void>;
    addCategory: (values: { name: string; color: string; icon: string }) => Promise<void>;
    editCategory: (categoryId: string, values: { name: string; color: string; icon: string }) => Promise<void>;
    deleteCategory: (categoryId: string) => Promise<void>;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    reorderCategories: (orderedIds: string[]) => Promise<void>;
    addMember: (values: { name: string; email: string; roleId: string; password: string;}) => Promise<void>;
    editMember: (memberId: string, values: Partial<MemberProfile>) => Promise<void>;
    deleteMember: (memberId: string) => Promise<void>;
    getMemberRole: (member: MemberProfile) => Role | undefined;
    addRole: (values: { name: string; permissions: Permission[] }) => Promise<void>;
    editRole: (roleId: string, values: { name: string; permissions: Permission[] }) => Promise<void>;
    deleteRole: (roleId: string) => Promise<void>;
    updateCurrentUser: (data: Partial<MemberProfile>) => Promise<void>;
    updateApprovalStatus: (approvalId: string, status: 'Approved' | 'Declined') => Promise<void>;
    addApproval: (values: Omit<Approval, 'id' | 'status' | 'owner'>) => Promise<void>;
    addTrip: (trip: TripFormData) => Promise<void>;
    editTrip: (tripId: string, values: Partial<Omit<Trip, 'id' | 'report' | 'memberId'>>) => Promise<void>;
    deleteTrip: (tripId: string) => Promise<void>;
    addSubscription: (values: SubscriptionFormData) => Promise<void>;
    editSubscription: (subscriptionId: string, values: SubscriptionFormData) => Promise<void>;
    deleteSubscription: (subscriptionId: string) => Promise<void>;
    sendMessage: (receiverId: string, text: string) => void;
    markConversationAsRead: (memberId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const staticBaseTime = new Date('2024-08-20T10:00:00.000Z').getTime();

const mapAccountData = (account: any): Account => ({ ...account, icon: iconMap[account.icon] || Wallet });
const mapCategoryData = (category: any): Category => ({ ...category, icon: iconMap[category.icon] || Shapes, iconName: category.icon });
const mapSubscriptionData = (subscription: any): Subscription => ({ ...subscription, icon: iconMap[subscription.icon] || Repeat, iconName: subscription.icon });

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    const router = useRouter();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<MemberProfile | null>(null);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [members, setMembers] = useState<MemberProfile[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [allPermissions, setAllPermissions] = useState<{ group: string; permissions: { id: Permission; label: string }[] }[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);

    const makeApiRequest = useCallback(async (url: string, options: RequestInit = {}) => {
        try {
            const response = await fetch(url, { headers: apiHeaders, ...options });
            if (response.status === 401) {
                // Token is invalid or expired, log out
                logout();
                throw new Error('Session expired. Please log in again.');
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'An API error occurred');
            }
            if (response.status === 204 || response.headers.get('content-length') === '0') {
              return null;
            }
            return response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            toast({ title: "API Error", description: (error as Error).message, variant: "destructive" });
            throw error;
        }
    }, [toast]);

    const fetchData = useCallback(async () => {
        try {
            const [ transactionsRes, accountsRes, categoriesRes, budgetsRes, tripsRes, approvalsRes, membersRes, rolesRes, subscriptionsRes, permissionsRes ] = await Promise.all([
                makeApiRequest(`${API_BASE_URL}/transactions`), makeApiRequest(`${API_BASE_URL}/accounts`), makeApiRequest(`${API_BASE_URL}/categories`),
                makeApiRequest(`${API_BASE_URL}/budgets`), makeApiRequest(`${API_BASE_URL}/trips`), makeApiRequest(`${API_BASE_URL}/approvals`),
                makeApiRequest(`${API_BASE_URL}/members`), makeApiRequest(`${API_BASE_URL}/roles`), makeApiRequest(`${API_BASE_URL}/subscriptions`),
                makeApiRequest(`${API_BASE_URL}/permissions`)
            ]);
            
            setTransactions(transactionsRes);
            setAccounts(accountsRes.map(mapAccountData));
            setCategories(categoriesRes.map(mapCategoryData));
            setBudgets(budgetsRes);
            setTrips(tripsRes);
            setApprovals(approvalsRes);
            setMembers(membersRes);
            setRoles(rolesRes.map((r: any) => ({...r, id: r._id})));
            setSubscriptions(subscriptionsRes.map(mapSubscriptionData));
            setAllPermissions(permissionsRes);

        } catch (error) {
            console.error("Failed to fetch initial data", error);
        }
    }, [makeApiRequest]);

    const getMemberRole = useCallback((member: MemberProfile): Role | undefined => roles.find(r => r.id === member.roleId), [roles]);
    const currentUserRole = useMemo(() => currentUser ? getMemberRole(currentUser) : undefined, [currentUser, getMemberRole]);
    const currentUserPermissions = useMemo(() => currentUserRole?.permissions ?? [], [currentUserRole]);
    
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const data = await makeApiRequest(`${API_BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
            if (data.token) {
                localStorage.setItem('token', data.token);
                apiHeaders = { ...apiHeaders, 'Authorization': `Bearer ${data.token}` };
                const decoded: { member: MemberProfile } = jwtDecode(data.token);
                
                // Fetch members list first to find the full profile
                const membersList = await makeApiRequest(`${API_BASE_URL}/members`);
                const userProfile = membersList.find((m: MemberProfile) => m.id === decoded.member.id);

                if (userProfile) {
                    setCurrentUser(userProfile);
                    setIsAuthenticated(true);
                    await fetchData(); // Fetch all data after authentication
                    setConversations([
                      { memberId: 'mem2', unreadCount: 0, messages: [ { id: 'msg1', senderId: 'mem1', text: 'Hey John, how is the project going?', timestamp: staticBaseTime - 1000 * 60 * 5 }, { id: 'msg2', senderId: 'mem2', text: 'Hi Janice! Going well. Just wrapping up the Q3 report.', timestamp: staticBaseTime - 1000 * 60 * 4 }, { id: 'msg3', senderId: 'mem1', text: 'Great to hear!', timestamp: staticBaseTime - 1000 * 60 * 3 }, ] },
                      { memberId: 'mem3', unreadCount: 1, messages: [ { id: 'msg4', senderId: 'mem3', text: 'Could you approve my expense for the flight to Brussels?', timestamp: staticBaseTime - 1000 * 60 * 20 }, ] }
                    ]);
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        apiHeaders = { 'Content-Type': 'application/json' };
        setCurrentUser(null);
        setIsAuthenticated(false);
        // Clear all data
        setTransactions([]);
        setAccounts([]);
        setCategories([]);
        setBudgets([]);
        setTrips([]);
        setApprovals([]);
        setMembers([]);
        setRoles([]);
        setSubscriptions([]);
        setAllPermissions([]);
        setConversations([]);
        router.push('/login');
    };

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                apiHeaders = { ...apiHeaders, 'Authorization': `Bearer ${token}` };
                 try {
                    const decoded: { member: { id: string } } = jwtDecode(token);
                    const membersList = await makeApiRequest(`${API_BASE_URL}/members`);
                    const userProfile = membersList.find((m: MemberProfile) => m.id === decoded.member.id);

                    if (userProfile) {
                        setCurrentUser(userProfile);
                        setIsAuthenticated(true);
                        await fetchData();
                        setConversations([
                          { memberId: 'mem2', unreadCount: 0, messages: [ { id: 'msg1', senderId: 'mem1', text: 'Hey John, how is the project going?', timestamp: staticBaseTime - 1000 * 60 * 5 }, { id: 'msg2', senderId: 'mem2', text: 'Hi Janice! Going well. Just wrapping up the Q3 report.', timestamp: staticBaseTime - 1000 * 60 * 4 }, { id: 'msg3', senderId: 'mem1', text: 'Great to hear!', timestamp: staticBaseTime - 1000 * 60 * 3 }, ] },
                          { memberId: 'mem3', unreadCount: 1, messages: [ { id: 'msg4', senderId: 'mem3', text: 'Could you approve my expense for the flight to Brussels?', timestamp: staticBaseTime - 1000 * 60 * 20 }, ] }
                        ]);
                    } else {
                        logout();
                    }
                } catch(e) {
                    logout();
                }
            }
            setIsLoading(false);
        };
        initializeAuth();
    }, [fetchData, makeApiRequest]);

    const pendingTasks = useMemo(() => {
        if (!currentUser) return [];
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
            { icon: Plane, label: 'My Pending Trips', value: trips.filter(t => t.status === 'Pending' && t.memberId === currentUser.id).length, color: 'bg-blue-600' },
            { icon: Receipt, label: 'My Unsubmitted Expenses', value: unsubmittedCount, color: 'bg-emerald-600' },
            { icon: CalendarClock, label: 'Upcoming Bills & Subscriptions', value: upcomingSubscriptionsCount, color: 'bg-orange-500' },
            { icon: Undo2, label: 'Pending Reimbursements', value: formatCurrency(pendingReimbursementsAmount, 'USD'), color: 'bg-purple-500' }
        ].filter(task => task.value > 0 || (typeof task.value === 'string' && task.value !== formatCurrency(0, 'USD')));

    }, [transactions, trips, approvals, currentUserPermissions, subscriptions, currentUser]);

    const addTransaction = async (values: Omit<Transaction, 'id'>) => {
        const newTransaction = await makeApiRequest(`${API_BASE_URL}/transactions`, { method: 'POST', body: JSON.stringify({ ...values, id: `txn-${Date.now()}` }) });
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const deleteTransactions = async (transactionIds: string[]) => {
        await makeApiRequest(`${API_BASE_URL}/transactions/bulk-delete`, { method: 'POST', body: JSON.stringify({ ids: transactionIds }) });
        setTransactions(prev => prev.filter(t => !transactionIds.includes(t.id)));
    };

    const addBudget = async (values: Omit<Budget, 'id' | 'status'>) => {
        const newBudget = await makeApiRequest(`${API_BASE_URL}/budgets`, { method: 'POST', body: JSON.stringify({ ...values, id: `bud-${Date.now()}`, status: 'active' }) });
        setBudgets(prev => [...prev, newBudget]);
    };

    const editBudget = async (budgetId: string, values: Omit<Budget, 'id'>) => {
        const updatedBudget = await makeApiRequest(`${API_BASE_URL}/budgets/${budgetId}`, { method: 'PUT', body: JSON.stringify(values) });
        setBudgets(prev => prev.map(b => b.id === budgetId ? updatedBudget : b));
    };

    const deleteBudget = async (budgetId: string) => {
        await makeApiRequest(`${API_BASE_URL}/budgets/${budgetId}`, { method: 'DELETE' });
        setBudgets(prev => prev.filter(b => b.id !== budgetId));
    };

    const archiveBudget = async (budgetId: string, status: 'active' | 'archived') => {
        const budget = budgets.find(b => b.id === budgetId);
        if(budget) {
            const updatedBudget = await makeApiRequest(`${API_BASE_URL}/budgets/${budgetId}`, { method: 'PUT', body: JSON.stringify({ ...budget, status }) });
            setBudgets(prev => prev.map(b => b.id === budgetId ? updatedBudget : b));
        }
    };

    const addCategory = async (values: { name: string; color: string; icon: string }) => {
        const newCategoryData = {
            id: `cat-${Date.now()}`,
            name: values.name,
            color: values.color,
            icon: values.icon,
            order: categories.length
        };
        const newCategory = await makeApiRequest(`${API_BASE_URL}/categories`, { method: 'POST', body: JSON.stringify(newCategoryData) });
        setCategories(prev => [...prev, mapCategoryData(newCategory)]);
    };

    const editCategory = async (categoryId: string, values: { name: string; color: string; icon: string }) => {
        const updatedCategory = await makeApiRequest(`${API_BASE_URL}/categories/${categoryId}`, { method: 'PUT', body: JSON.stringify({ name: values.name, color: values.color, icon: values.icon }) });
        setCategories(prev => prev.map(c => (c.id === categoryId ? mapCategoryData(updatedCategory) : c)));
    };
    
    const reorderCategories = async (orderedIds: string[]) => {
        await makeApiRequest(`${API_BASE_URL}/categories/reorder`, { method: 'POST', body: JSON.stringify({ orderedIds }) });
    };

    const deleteCategory = async (categoryId: string) => {
        await makeApiRequest(`${API_BASE_URL}/categories/${categoryId}`, { method: 'DELETE' });
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    };

    const addMember = async (values: { name: string; email: string; roleId: string; password: string;}) => {
        const newMemberData = {
            id: `mem-${Date.now()}`,
            ...values,
            avatar: 'https://placehold.co/100x100.png',
            avatarHint: 'person portrait',
        };
        const newMember = await makeApiRequest(`${API_BASE_URL}/members`, { method: 'POST', body: JSON.stringify(newMemberData) });
        setMembers(prev => [...prev, newMember]);
    };

    const editMember = async (memberId: string, values: Partial<MemberProfile>) => {
        const updatedMember = await makeApiRequest(`${API_BASE_URL}/members/${memberId}`, { method: 'PUT', body: JSON.stringify(values) });
        setMembers(prev => prev.map(m => (m.id === memberId ? { ...m, ...updatedMember } : m)));
        if(currentUser && currentUser.id === memberId) {
            setCurrentUser(prev => prev ? { ...prev, ...updatedMember } : null);
        }
    };

    const deleteMember = async (memberId: string) => {
        await makeApiRequest(`${API_BASE_URL}/members/${memberId}`, { method: 'DELETE' });
        setMembers(prev => prev.filter(m => m.id !== memberId));
    };
    
    const addRole = async (values: { name: string; permissions: Permission[] }) => {
        const newRole = await makeApiRequest(`${API_BASE_URL}/roles`, { method: 'POST', body: JSON.stringify(values) });
        setRoles(prev => [...prev, {...newRole, id: newRole._id}]);
    };

    const editRole = async (roleId: string, values: { name: string; permissions: Permission[] }) => {
        const updatedRole = await makeApiRequest(`${API_BASE_URL}/roles/${roleId}`, { method: 'PUT', body: JSON.stringify(values) });
        setRoles(prev => prev.map(r => (r.id === roleId ? {...updatedRole, id: updatedRole._id} : r)));
    };

    const deleteRole = async (roleId: string) => {
        await makeApiRequest(`${API_BASE_URL}/roles/${roleId}`, { method: 'DELETE' });
        setRoles(prev => prev.filter(r => r.id !== roleId));
    };

    const updateCurrentUser = async (data: Partial<MemberProfile>) => {
        if(currentUser) {
            await editMember(currentUser.id, data);
        }
    };
    
    const addApproval = async (values: Omit<Approval, 'id' | 'status' | 'owner'>) => {
        if(!currentUser) return;
        const newApprovalData = {
            id: `appr-${Date.now()}`,
            ...values,
            status: 'Pending',
            owner: {
                name: currentUser.name,
                title: getMemberRole(currentUser)?.name || 'Member',
                avatar: currentUser.avatar,
                avatarHint: currentUser.avatarHint,
            }
        };
        const newApproval = await makeApiRequest(`${API_BASE_URL}/approvals`, { method: 'POST', body: JSON.stringify(newApprovalData) });
        setApprovals(prev => [newApproval, ...prev]);
    };
    
    const updateApprovalStatus = async (approvalId: string, status: 'Approved' | 'Declined') => {
        const updatedApproval = await makeApiRequest(`${API_BASE_URL}/approvals/${approvalId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
        setApprovals(prev => prev.map(a => a.id === approvalId ? updatedApproval : a));
    };
    
    const addTrip = async (tripData: TripFormData) => {
        const newTripData = {
            id: `trip-${Date.now()}`,
            ...tripData,
            status: 'Pending',
            report: `${format(parseISO(tripData.departDate), 'MMMM_yyyy')}`
        };
        const newTrip = await makeApiRequest(`${API_BASE_URL}/trips`, { method: 'POST', body: JSON.stringify(newTripData) });
        setTrips(prev => [...prev, newTrip]);
    };
    
    const editTrip = async (tripId: string, values: Partial<Omit<Trip, 'id' | 'report' | 'memberId'>>) => {
        await makeApiRequest(`${API_BASE_URL}/trips/${tripId}`, { method: 'PUT', body: JSON.stringify(values) });
        setTrips(prev => prev.map(t => t.id === tripId ? { ...t, ...values } : t));
    };

    const deleteTrip = async (tripId: string) => {
        await makeApiRequest(`${API_BASE_URL}/trips/${tripId}`, { method: 'DELETE' });
        setTrips(prev => prev.filter(t => t.id !== tripId));
    };

    const addSubscription = async (values: SubscriptionFormData) => {
        const newSubscriptionData = {
            id: `sub-${Date.now()}`,
            ...values,
            icon: values.iconName
        };
        const newSubscription = await makeApiRequest(`${API_BASE_URL}/subscriptions`, { method: 'POST', body: JSON.stringify(newSubscriptionData) });
        setSubscriptions(prev => [...prev, mapSubscriptionData(newSubscription)]);
    };

    const editSubscription = async (subscriptionId: string, values: SubscriptionFormData) => {
        const updatedSubscription = await makeApiRequest(`${API_BASE_URL}/subscriptions/${subscriptionId}`, { method: 'PUT', body: JSON.stringify({ ...values, icon: values.iconName }) });
        setSubscriptions(prev => prev.map(s => s.id === subscriptionId ? mapSubscriptionData(updatedSubscription) : s));
    };

    const deleteSubscription = async (subscriptionId: string) => {
        await makeApiRequest(`${API_BASE_URL}/subscriptions/${subscriptionId}`, { method: 'DELETE' });
        setSubscriptions(prev => prev.filter(s => s.id !== subscriptionId));
    };

    const markConversationAsRead = (memberId: string) => { setConversations(prev => prev.map(c => c.memberId === memberId ? { ...c, unreadCount: 0 } : c)); };
    const sendMessage = (receiverId: string, text: string) => {
        if(!currentUser) return;
        const newMessage: ChatMessage = { id: `msg-${Date.now()}`, senderId: currentUser.id, text, timestamp: Date.now() };
        setConversations(prev => {
            const conversationExists = prev.some(c => c.memberId === receiverId);
            if (conversationExists) { return prev.map(c => c.memberId === receiverId ? { ...c, messages: [...c.messages, newMessage] } : c); }
            else { return [...prev, { memberId: receiverId, messages: [newMessage], unreadCount: 0, }]; }
        });
    };

    const value = {
        isAuthenticated, isLoading, login, logout,
        transactions, accounts, categories, budgets, pendingTasks, trips, approvals, members, roles, subscriptions, allPermissions,
        currentUser, currentUserPermissions, conversations, addTransaction, deleteTransactions, addBudget, editBudget, deleteBudget,
        archiveBudget, addCategory, editCategory, deleteCategory, setCategories, reorderCategories, addMember, editMember, deleteMember,
        getMemberRole, addRole, editRole, deleteRole, updateCurrentUser, addApproval, updateApprovalStatus, addTrip, editTrip,
        deleteTrip, addSubscription, editSubscription, deleteSubscription, sendMessage, markConversationAsRead,
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
