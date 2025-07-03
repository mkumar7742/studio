
"use client";

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import type { Transaction, Account, Category, MemberProfile, Role, Permission, AuditLog, Approval, ChatMessage, Budget, Family } from '@/types';
import { Briefcase, Car, Film, GraduationCap, HeartPulse, Home, Landmark, PawPrint, Pizza, Plane, Receipt, Shapes, ShoppingCart, Sprout, UtensilsCrossed, Gift, Shirt, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, CreditCard, Wallet, ScrollText, Repeat, PiggyBank } from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { jwtDecode } from "jwt-decode";


const API_BASE_URL = '/api';

const apiHeaders: Record<string, string> = { 'Content-Type': 'application/json' };

const iconMap: { [key: string]: LucideIcon } = {
    Briefcase, Landmark, UtensilsCrossed, ShoppingCart, HeartPulse, Car, GraduationCap, Film, Gift, Plane, Home, PawPrint, Receipt, Pizza, Shirt, Sprout, Shapes, Dumbbell, Wrench, Sofa, Popcorn, Store, Baby, Train, Wifi, PenSquare, ClipboardCheck, CreditCard, Wallet, ScrollText, Repeat, PiggyBank
};

export type FullTransaction = Omit<Transaction, 'id' | 'receiptUrl'>;

interface AppContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    transactions: Transaction[];
    visibleTransactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    members: MemberProfile[];
    roles: Role[];
    families: Family[];
    allPermissions: { group: string; permissions: { id: Permission; label: string }[] }[];
    auditLogs: AuditLog[];
    approvals: Approval[];
    budgets: Budget[];
    currentUser: MemberProfile | null;
    currentUserPermissions: Permission[];
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
    editMember: (memberId: string, values: Partial<Omit<MemberProfile, 'email'>>) => Promise<void>;
    deleteMember: (memberId: string) => Promise<void>;
    getMemberRole: (member: MemberProfile) => Role | undefined;
    addRole: (values: { name: string; permissions: Permission[] }) => Promise<void>;
    editRole: (roleId: string, values: { name: string; permissions: Permission[] }) => Promise<void>;
    deleteRole: (roleId: string) => Promise<void>;
    addApproval: (values: Omit<Approval, 'id' | 'status' | 'requestDate' | 'memberId' | 'memberName' | 'familyId'>) => Promise<void>;
    updateApproval: (approvalId: string, status: 'approved' | 'rejected', notes: string) => Promise<void>;
    addBudget: (values: { categoryId: string; amount: number; period: 'monthly' | 'yearly' }) => Promise<void>;
    editBudget: (budgetId: string, values: { categoryId: string; amount: number; period: 'monthly' | 'yearly' }) => Promise<void>;
    deleteBudget: (budgetId: string) => Promise<void>;
    updateCurrentUser: (data: Partial<Omit<MemberProfile, 'email' | 'roleId'>>) => Promise<void>;
    sendMessage: (receiverId: string, text: string) => Promise<void>;
    markConversationAsRead: (partnerId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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
    const [families, setFamilies] = useState<Family[]>([]);
    const [allPermissions, setAllPermissions] = useState<{ group: string; permissions: { id: Permission; label: string }[] }[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [approvals, setApprovals] = useState<Approval[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);


    const logout = useCallback(() => {
        localStorage.removeItem('token');
        delete apiHeaders['Authorization'];
        setCurrentUser(null);
        setIsAuthenticated(false);
        setTransactions([]); setAccounts([]); setCategories([]); 
        setMembers([]); setRoles([]); setAllPermissions([]); 
        setAuditLogs([]); setApprovals([]); setBudgets([]); setFamilies([]);
        setChatMessages([]);
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
    
    const fetchDataForUser = useCallback(async (user: MemberProfile) => {
        const permissions = user.permissions || [];
        const isSystemAdmin = user.roleName === 'System Administrator';
        const hasPermission = (p: Permission) => permissions.includes(p);

        try {
            const promises = [
                hasPermission('expenses:view') || hasPermission('income:view') ? makeApiRequest(`${API_BASE_URL}/transactions`) : Promise.resolve([]),
                makeApiRequest(`${API_BASE_URL}/accounts`),
                hasPermission('categories:view') ? makeApiRequest(`${API_BASE_URL}/categories`) : Promise.resolve([]),
                hasPermission('members:view') ? makeApiRequest(`${API_BASE_URL}/members`) : Promise.resolve([]),
                hasPermission('roles:manage') ? makeApiRequest(`${API_BASE_URL}/roles`) : Promise.resolve([]),
                makeApiRequest(`${API_BASE_URL}/permissions`),
                hasPermission('audit:view') ? makeApiRequest(`${API_BASE_URL}/audit`) : Promise.resolve([]),
                hasPermission('approvals:request') || hasPermission('approvals:manage') ? makeApiRequest(`${API_BASE_URL}/approvals`) : Promise.resolve([]),
                hasPermission('budgets:view') ? makeApiRequest(`${API_BASE_URL}/budgets`) : Promise.resolve([]),
                isSystemAdmin ? makeApiRequest(`${API_BASE_URL}/families`) : Promise.resolve([]),
                !isSystemAdmin ? makeApiRequest(`${API_BASE_URL}/chat/conversations`) : Promise.resolve([]),
            ];

            const [ transactionsRes, accountsRes, categoriesRes, membersRes, rolesRes, permissionsRes, auditLogsRes, approvalsRes, budgetsRes, familiesRes, chatMessagesRes ] = await Promise.all(promises);
            
            setTransactions(transactionsRes || []);
            setAccounts((accountsRes || []).map(mapAccountData));
            setCategories((categoriesRes || []).map(mapCategoryData).sort((a,b) => a.order - b.order));
            setMembers(membersRes || []);
            setRoles(rolesRes || []);
            setAllPermissions(permissionsRes || []);
            setAuditLogs(auditLogsRes || []);
            setApprovals(approvalsRes || []);
            setBudgets(budgetsRes || []);
            setFamilies(familiesRes || []);
            setChatMessages((chatMessagesRes || []).map((msg: any) => ({...msg, timestamp: new Date(msg.timestamp).getTime() })));

        } catch (error) {
            console.error("Failed to fetch initial data", error);
            logout();
        }
    }, [makeApiRequest, logout]);

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
                await fetchDataForUser(userProfile);
                
                setIsLoading(false);
                return true;
            }
            setIsLoading(false);
            return false;
        } catch (error) {
            setIsLoading(false);
            return false;
        }
    }, [makeApiRequest, fetchDataForUser]);

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
                    await fetchDataForUser(userProfile);
                } else {
                    logout();
                }
            } catch(e) {
                logout();
            }
        }
        setIsLoading(false);
    }, [fetchDataForUser, makeApiRequest, logout]);

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);


    const getMemberRole = useCallback((member: MemberProfile): Role | undefined => roles.find(r => r.id === member.roleId), [roles]);
    const currentUserPermissions = useMemo(() => currentUser?.permissions ?? [], [currentUser]);
    const isFamilyHead = useMemo(() => currentUser?.roleName === 'Family Head', [currentUser]);

    const visibleTransactions = useMemo(() => {
        if (!currentUser) return [];
        if (isFamilyHead || currentUser.roleName === 'System Administrator') return transactions;
        return transactions.filter(t => t.member === currentUser.name);
    }, [transactions, isFamilyHead, currentUser]);

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
        // The optimistic update is already handled in the component
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

    const editMember = useCallback(async (memberId: string, values: Partial<Omit<MemberProfile, 'email'>>) => {
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

    const addApproval = useCallback(async (values: Omit<Approval, 'id' | 'status' | 'requestDate' | 'memberId' | 'memberName' | 'familyId'>) => {
        const newApproval = await makeApiRequest(`${API_BASE_URL}/approvals`, { method: 'POST', body: JSON.stringify(values) });
        setApprovals(prev => [newApproval, ...prev].sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
    }, [makeApiRequest]);

    const updateApproval = useCallback(async (approvalId: string, status: 'approved' | 'rejected', notes: string) => {
        const updatedApproval = await makeApiRequest(`${API_BASE_URL}/approvals/${approvalId}`, { method: 'PUT', body: JSON.stringify({ status, notes }) });
        setApprovals(prev => prev.map(a => a.id === approvalId ? updatedApproval : a));
    }, [makeApiRequest]);

    const addBudget = useCallback(async (values: { categoryId: string; amount: number; period: 'monthly' | 'yearly' }) => {
        const newBudget = await makeApiRequest(`${API_BASE_URL}/budgets`, { method: 'POST', body: JSON.stringify(values) });
        setBudgets(prev => [...prev, newBudget]);
    }, [makeApiRequest]);

    const editBudget = useCallback(async (budgetId: string, values: { categoryId: string; amount: number; period: 'monthly' | 'yearly' }) => {
        const updatedBudget = await makeApiRequest(`${API_BASE_URL}/budgets/${budgetId}`, { method: 'PUT', body: JSON.stringify(values) });
        setBudgets(prev => prev.map(b => (b.id === budgetId ? updatedBudget : b)));
    }, [makeApiRequest]);

    const deleteBudget = useCallback(async (budgetId: string) => {
        await makeApiRequest(`${API_BASE_URL}/budgets/${budgetId}`, { method: 'DELETE' });
        setBudgets(prev => prev.filter(b => b.id !== budgetId));
    }, [makeApiRequest]);
    
    const updateCurrentUser = useCallback(async (data: Partial<Omit<MemberProfile, 'email' | 'roleId'>>) => {
        if(currentUser) {
            await editMember(currentUser.id, data);
        }
    }, [currentUser, editMember]);
    
    const sendMessage = useCallback(async (receiverId: string, text: string) => {
        if(!currentUser) return;
        
        const response = await makeApiRequest(`${API_BASE_URL}/chat`, {
            method: 'POST',
            body: JSON.stringify({ receiverId, text })
        });
        
        const newMessage = { ...response, timestamp: new Date(response.timestamp).getTime() };

        setChatMessages(prev => [...prev, newMessage]);

    }, [currentUser, makeApiRequest]);

    const markConversationAsRead = useCallback(async (partnerId: string) => {
        if (!currentUser) return;
        
        const updatedMessages = chatMessages.map(msg => 
            (msg.senderId === partnerId && msg.receiverId === currentUser.id && !msg.isRead) 
                ? { ...msg, isRead: true } 
                : msg
        );
        setChatMessages(updatedMessages);

        await makeApiRequest(`${API_BASE_URL}/chat/mark-as-read`, { 
            method: 'POST', 
            body: JSON.stringify({ partnerId }) 
        });
    }, [currentUser, chatMessages, makeApiRequest]);


    const value = useMemo(() => ({
        isAuthenticated, isLoading, login, logout,
        transactions, accounts, categories, members, roles, allPermissions, auditLogs, approvals, budgets, families,
        visibleTransactions,
        currentUser, currentUserPermissions,
        addTransaction, deleteTransactions, addCategory, editCategory, deleteCategory, setCategories, reorderCategories, addMember, editMember, deleteMember,
        getMemberRole, addRole, editRole, deleteRole, addApproval, updateApproval, addBudget, editBudget, deleteBudget, updateCurrentUser, sendMessage, markConversationAsRead,
    }), [
        isAuthenticated, isLoading, login, logout,
        transactions, accounts, categories, members, roles, allPermissions, auditLogs, approvals, budgets, families,
        visibleTransactions,
        currentUser, currentUserPermissions, addTransaction, deleteTransactions, addCategory, editCategory, deleteCategory, setCategories, reorderCategories, addMember, editMember, deleteMember,
        getMemberRole, addRole, editRole, deleteRole, addApproval, updateApproval, addBudget, editBudget, deleteBudget, updateCurrentUser, sendMessage, markConversationAsRead,
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
