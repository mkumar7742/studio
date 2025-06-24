"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Transaction, Account, Category, Budget } from '@/types';
import {
    accounts as initialAccounts,
    categories as initialCategories,
    transactions as initialTransactions,
    budgets as initialBudgets,
} from '@/lib/data';
import type { AddTransactionValues } from '@/components/add-transaction-form';
import { format } from 'date-fns';
import { Shapes } from 'lucide-react';

interface AppContextType {
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    budgets: Budget[];
    addTransaction: (values: AddTransactionValues) => void;
    addBudget: (budget: Omit<Budget, 'spent'>) => void;
    addCategory: (values: { name: string; color: string }) => void;
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);

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

    const addCategory = (values: { name: string; color: string }) => {
        const newCategory: Category = {
            id: `cat-${Date.now()}`,
            name: values.name,
            color: values.color,
            icon: Shapes,
        };
        setCategories(prev => [...prev, newCategory]);
    };

    const value = {
        transactions,
        accounts,
        categories,
        budgets,
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
