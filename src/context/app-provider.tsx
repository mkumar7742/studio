
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import type { Transaction, Account, Category, MemberProfile, Role, Permission, Conversation, AuditLog } from '@/types';
import { Briefcase, Car, Film, GraduationCap, HeartPulse, Home, Landmark, PawPrint, Pizza, Plane, Receipt, Shapes, ShoppingCart, Sprout, UtensilsCrossed, Gift, Shirt, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, Clock, CalendarClock, Undo2, Repeat, Clapperboard, Music, Cloud, Sparkles, CreditCard, PiggyBank, Wallet, ScrollText, Building } from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from "jwt-decode";


const API_BASE_URL = 'http://localhost:5001/api';

const apiHeaders: Record<string, string> = { 'Content-Type': 'application/json' };

const iconMap: { [key: string]: LucideIcon } = {
    Briefcase, Landmark, UtensilsCrossed, ShoppingCart, HeartPulse, Car, GraduationCap, Film, Gift, Plane, Home, PawPrint, Receipt, Pizza, Shirt, Sprout, Shapes, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, Clock, CalendarClock, Undo2, Repeat, Clapperboard, Music, Cloud, Sparkles, CreditCard, PiggyBank, Wallet, ScrollText, Building
};

export type FullTransaction = Omit<Transaction, 'id' | 'receiptUrl'>;

interface AppContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    members: MemberProfile[];
    roles: Role[];
    allPermissions: { group: string; permissions: { id: Permission; label: string }[] }[];
    auditLogs: AuditLog[];
    currentUser: MemberProfile | null;
    currentUserPermissions: Permission[];
    conversations: Conversation[];
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => void;
    addTransaction: (values: Omit<Transaction, 'id'>) => Promise<void>;
    deleteTransactions: (transactionIds: string[]) => Promise<void>;
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
    sendMessage: (receiverId: string, text: string) => void;
    markConversationAsRead: (memberId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const staticBaseTime = new Date('2024-08-20T10:00:00.000Z').getTime();

const mapAccountData = (account: any): Account => ({ ...account, icon: iconMap[account.icon] || Wallet });
const mapCategoryData = (category: any): Category => ({ ...category, icon: iconMap[category.icon] || Shapes, iconName: category.icon });

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<MemberProfile | null>(null);

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [members, setMembers] = useState<MemberProfile[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [allPermissions, setAllPermissions] = useState<{ group: string; permissions: { id: Permission; label: string }[] }[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        delete apiHeaders['Authorization'];
        setCurrentUser(null);
        setIsAuthenticated(false);
        setTransactions([]); setAccounts([]); setCategories([]); 
        setMembers([]); setRoles([]); setAllPermissions([]); 
        setConversations([]); setAuditLogs([]);
        window.location.href = '/login';
    }, []);

    const makeApiRequest = useCallback(async (url: string, options: RequestInit = {}) => {
        try {
            const response = await fetch(url, { headers: apiHeaders, ...options });
            if (response.status === 401) {
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
            if (!(error as Error).message.includes('Session expired')) {
                 toast({ title: "API Error", description: (error as Error).message, variant: "destructive" });
            }
            throw error;
        }
    }, [toast, logout]);
    
    const fetchData = useCallback(async (permissions: Permission[]) => {
        const hasPermission = (p: Permission) => permissions.includes(p) || permissions.includes('roles:manage');

        try {
            const promises = [
                hasPermission('expenses:view') || hasPermission('income:view') ? makeApiRequest(`${API_BASE_URL}/transactions`) : Promise.resolve([]),
                makeApiRequest(`${API_BASE_URL}/accounts`),
                hasPermission('categories:view') ? makeApiRequest(`${API_BASE_URL}/categories`) : Promise.resolve([]),
                hasPermission('members:view') ? makeApiRequest(`${API_BASE_URL}/members`) : Promise.resolve([]),
                hasPermission('roles:manage') ? makeApiRequest(`${API_BASE_URL}/roles`) : Promise.resolve([]),
                makeApiRequest(`${API_BASE_URL}/permissions`),
                hasPermission('audit:view') ? makeApiRequest(`${API_BASE_URL}/audit`) : Promise.resolve([])
            ];

            const [ transactionsRes, accountsRes, categoriesRes, membersRes, rolesRes, permissionsRes, auditLogsRes ] = await Promise.all(promises);
            
            setTransactions(transactionsRes || []);
            setAccounts((accountsRes || []).map(mapAccountData));
            setCategories((categoriesRes || []).map(mapCategoryData));
            setMembers(membersRes || []);
            setRoles(rolesRes || []);
            setAllPermissions(permissionsRes || []);
            setAuditLogs(auditLogsRes || []);

        } catch (error) {
            console.error("Failed to fetch initial data", error);
        }
    }, [makeApiRequest]);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const data = await makeApiRequest(`${API_BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify({ email, password }) });
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                apiHeaders['Authorization'] = `Bearer ${data.token}`;
                
                const userProfile = data.user as MemberProfile;
                setCurrentUser(userProfile);
                setIsAuthenticated(true);
                await fetchData(userProfile.permissions || []);
                
                setConversations([
                  { memberId: 'mem2', unreadCount: 0, messages: [ { id: 'msg1', senderId: 'mem1', text: 'Hey John, how is the project going?', timestamp: staticBaseTime - 1000 * 60 * 5 }, { id: 'msg2', senderId: 'mem2', text: 'Hi Janice! Going well. Just wrapping up the Q3 report.', timestamp: staticBaseTime - 1000 * 60 * 4 }, { id: 'msg3', senderId: 'mem1', text: 'Great to hear!', timestamp: staticBaseTime - 1000 * 60 * 3 }, ] },
                  { memberId: 'mem3', unreadCount: 1, messages: [ { id: 'msg4', senderId: 'mem3', text: 'Could you approve my expense for the flight to Brussels?', timestamp: staticBaseTime - 1000 * 60 * 20 }, ] }
                ]);
                setIsLoading(false);
                return true;
            }
            setIsLoading(false);
            return false;
        } catch (error) {
            setIsLoading(false);
            return false;
        }
    }, [makeApiRequest, fetchData]);

    const initializeAuth = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            apiHeaders['Authorization'] = `Bearer ${token}`;
             try {
                const decoded: { exp: number } = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                    return;
                }

                const userProfile = await makeApiRequest(`${API_BASE_URL}/auth/me`);

                if (userProfile) {
                    setCurrentUser(userProfile);
                    setIsAuthenticated(true);
                    await fetchData(userProfile.permissions || []);
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
    }, [fetchData, makeApiRequest, logout]);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    const getMemberRole = useCallback((member: MemberProfile): Role | undefined => roles.find(r => r.id === member.roleId), [roles]);
    const currentUserPermissions = useMemo(() => currentUser?.permissions ?? [], [currentUser]);

    const addTransaction = useCallback(async (values: Omit<Transaction, 'id'>) => {
        const newTransaction = await makeApiRequest(`${API_BASE_URL}/transactions`, { method: 'POST', body: JSON.stringify(values) });
        setTransactions(prev => [newTransaction, ...prev]);
    }, [makeApiRequest]);

    const deleteTransactions = useCallback(async (transactionIds: string[]) => {
        await makeApiRequest(`${API_BASE_URL}/transactions/bulk-delete`, { method: 'POST', body: JSON.stringify({ ids: transactionIds }) });
        setTransactions(prev => prev.filter(t => !transactionIds.includes(t.id)));
    }, [makeApiRequest]);

    const addCategory = useCallback(async (values: { name: string; color: string; icon: string }) => {
        const newCategoryData = { ...values, order: categories.length };
        const newCategory = await makeApiRequest(`${API_BASE_URL}/categories`, { method: 'POST', body: JSON.stringify(newCategoryData) });
        setCategories(prev => [...prev, mapCategoryData(newCategory)]);
    }, [makeApiRequest, categories.length]);

    const editCategory = useCallback(async (categoryId: string, values: { name: string; color: string; icon: string }) => {
        const updatedCategory = await makeApiRequest(`${API_BASE_URL}/categories/${categoryId}`, { method: 'PUT', body: JSON.stringify({ ...values }) });
        setCategories(prev => prev.map(c => (c.id === categoryId ? mapCategoryData(updatedCategory) : c)));
    }, [makeApiRequest]);
    
    const reorderCategories = useCallback(async (orderedIds: string[]) => {
        await makeApiRequest(`${API_BASE_URL}/categories/reorder`, { method: 'POST', body: JSON.stringify({ orderedIds }) });
    }, [makeApiRequest]);

    const deleteCategory = useCallback(async (categoryId: string) => {
        await makeApiRequest(`${API_BASE_URL}/categories/${categoryId}`, { method: 'DELETE' });
        setCategories(prev => prev.filter(c => c.id !== categoryId));
    }, [makeApiRequest]);

    const addMember = useCallback(async (values: { name: string; email: string; roleId: string; password: string;}) => {
        const newMemberData = { ...values, avatar: 'https://placehold.co/100x100.png', avatarHint: 'person portrait' };
        const newMember = await makeApiRequest(`${API_BASE_URL}/members`, { method: 'POST', body: JSON.stringify(newMemberData) });
        setMembers(prev => [...prev, newMember]);
    }, [makeApiRequest]);

    const editMember = useCallback(async (memberId: string, values: Partial<MemberProfile>) => {
        const updatedMember = await makeApiRequest(`${API_BASE_URL}/members/${memberId}`, { method: 'PUT', body: JSON.stringify(values) });
        setMembers(prev => prev.map(m => (m.id === memberId ? { ...m, ...updatedMember } : m)));
        if(currentUser && currentUser.id === memberId) {
            setCurrentUser(prev => prev ? { ...prev, ...updatedMember } : null);
        }
    }, [makeApiRequest, currentUser]);

    const deleteMember = useCallback(async (memberId: string) => {
        await makeApiRequest(`${API_BASE_URL}/members/${memberId}`, { method: 'DELETE' });
        setMembers(prev => prev.filter(m => m.id !== memberId));
    }, [makeApiRequest]);
    
    const addRole = useCallback(async (values: { name: string; permissions: Permission[] }) => {
        const newRole = await makeApiRequest(`${API_BASE_URL}/roles`, { method: 'POST', body: JSON.stringify(values) });
        setRoles(prev => [...prev, newRole]);
    }, [makeApiRequest]);

    const editRole = useCallback(async (roleId: string, values: { name: string; permissions: Permission[] }) => {
        const updatedRole = await makeApiRequest(`${API_BASE_URL}/roles/${roleId}`, { method: 'PUT', body: JSON.stringify(values) });
        setRoles(prev => prev.map(r => (r.id === roleId ? updatedRole : r)));
    }, [makeApiRequest]);

    const deleteRole = useCallback(async (roleId: string) => {
        await makeApiRequest(`${API_BASE_URL}/roles/${roleId}`, { method: 'DELETE' });
        setRoles(prev => prev.filter(r => r.id !== roleId));
    }, [makeApiRequest]);

    const updateCurrentUser = useCallback(async (data: Partial<MemberProfile>) => {
        if(currentUser) {
            await editMember(currentUser.id, data);
        }
    }, [currentUser, editMember]);
    
    const markConversationAsRead = useCallback((memberId: string) => {
        setConversations(prev => prev.map(c => c.memberId === memberId ? { ...c, unreadCount: 0 } : c));
    }, []);

    const sendMessage = useCallback((receiverId: string, text: string) => {
        if(!currentUser) return;
        const newMessage: ChatMessage = { id: `msg-${Date.now()}`, senderId: currentUser.id, text, timestamp: Date.now() };
        setConversations(prev => {
            const conversationExists = prev.some(c => c.memberId === receiverId);
            if (conversationExists) { return prev.map(c => c.memberId === receiverId ? { ...c, messages: [...c.messages, newMessage] } : c); }
            else { return [...prev, { memberId: receiverId, messages: [newMessage], unreadCount: 0, }]; }
        });
    }, [currentUser]);

    const value = useMemo(() => ({
        isAuthenticated, isLoading, login, logout,
        transactions, accounts, categories, members, roles, allPermissions, auditLogs,
        currentUser, currentUserPermissions, conversations, addTransaction, deleteTransactions, addCategory, editCategory, deleteCategory, setCategories, reorderCategories, addMember, editMember, deleteMember,
        getMemberRole, addRole, editRole, deleteRole, updateCurrentUser, sendMessage, markConversationAsRead,
    }), [
        isAuthenticated, isLoading, login, logout,
        transactions, accounts, categories, members, roles, allPermissions, auditLogs,
        currentUser, currentUserPermissions, conversations, addTransaction, deleteTransactions, addCategory, editCategory, deleteCategory, setCategories, reorderCategories, addMember, editMember, deleteMember,
        getMemberRole, addRole, editRole, deleteRole, updateCurrentUser, sendMessage, markConversationAsRead,
    ]);

    return (
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    );
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}
