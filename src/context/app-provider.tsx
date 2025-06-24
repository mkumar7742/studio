
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Transaction, Account, Category, Budget, PendingTask } from '@/types';
import {
    accounts as initialAccounts,
    categories as initialCategories,
    transactions as initialTransactions,
    budgets as initialBudgets,
    pendingTasks as initialPendingTasks
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
    addTransaction: (values: AddTransactionValues) => void;
    addBudget: (budget: Omit<Budget, 'spent'>) => void;
    addCategory: (values: { name: string; color: string; icon: string }) => void;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
    const [pendingTasks, setPendingTasks] = useState<PendingTask[]>(initialPendingTasks);

    const addTransaction = (values: AddTransactionValues) => {
        const newTransaction: Transaction = {
            id: `txn-${Date.now()}`,
            type: values.type,
            description: values.description,
            amount: values.amount,
            category: values.category,
            accountId: values.accountId,
            date: format(values.date, "MMMM d"),
            receiptUrl: values.receipt ? URL.createObjectURL(values.receipt) : null,
            employee: 'You',
            team: 'Personal'
        };
        setTransactions(prev => [newTransaction, ...prev]);
    };

    const addBudget = (budget: Omit<Budget, 'spent'>) => {
        const newBudget: Budget = {
            ...budget,
            spent: 0
        };
        setBudgets(prev => [...prev, newBudget]);
    }

    const addCategory = (values: { name: string; color: string; icon: string }) => {
        const newCategory: Category = {
            id: `cat-${Date.now()}`,
            name: values.name,
            color: values.color,
            icon: iconMap[values.icon] || Shapes,
        };
        setCategories(prev => [...prev, newCategory]);
    };

    const value = {
        transactions,
        accounts,
        categories,
        budgets,
        pendingTasks,
        addTransaction,
        addBudget,
        addCategory,
        setCategories,
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
