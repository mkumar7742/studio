
const mongoose = require('mongoose');

const initialData = {
    roles: [
        {
            _id: 'role-admin',
            name: 'Administrator',
            permissions: [
              'dashboard:view',
              'expenses:view', 'expenses:create', 'expenses:edit', 'expenses:delete',
              'income:view', 'income:create', 'income:edit', 'income:delete',
              'trips:view', 'trips:create',
              'approvals:view', 'approvals:action',
              'categories:view', 'categories:create', 'categories:edit', 'categories:delete',
              'members:view', 'members:create', 'members:edit', 'members:delete',
              'roles:manage',
              'budgets:manage',
              'calendar:view',
              'subscriptions:manage',
              'audit:view',
            ],
        },
        {
            _id: 'role-manager',
            name: 'Manager',
            permissions: [
              'dashboard:view',
              'expenses:view', 'expenses:create', 'expenses:edit',
              'income:view', 'income:create', 'income:edit',
              'trips:view', 'trips:create',
              'approvals:view', 'approvals:action',
              'categories:view',
              'members:view',
              'budgets:manage',
              'calendar:view',
              'subscriptions:manage',
            ],
        },
        {
            _id: 'role-member',
            name: 'Member',
            permissions: [
              'dashboard:view',
              'expenses:view', 'expenses:create',
              'income:view', 'income:create',
              'trips:view', 'trips:create',
              'calendar:view',
            ],
        },
    ],
    categories: [
        { _id: 'cat-1', name: 'Income', icon: 'Briefcase', color: 'hsl(var(--chart-1))', order: 0 },
        { _id: 'cat-2', name: 'Rent', icon: 'Landmark', color: 'hsl(var(--chart-2))', order: 1 },
        { _id: 'cat-3', name: 'Food', icon: 'UtensilsCrossed', color: 'hsl(var(--chart-3))', order: 2 },
        { _id: 'cat-4', name: 'Shopping', icon: 'ShoppingCart', color: 'hsl(var(--chart-4))', order: 3 },
        { _id: 'cat-5', name: 'Health', icon: 'HeartPulse', color: 'hsl(var(--chart-5))', order: 4 },
        { _id: 'cat-6', name: 'Transport', icon: 'Car', color: 'hsl(var(--chart-1))', order: 5 },
        { _id: 'cat-7', name: 'Education', icon: 'GraduationCap', color: 'hsl(var(--chart-2))', order: 6 },
        { _id: 'cat-8', name: 'Entertainment', icon: 'Film', color: 'hsl(var(--chart-3))', order: 7 },
        { _id: 'cat-9', name: 'Supplies', icon: 'PenSquare', color: 'hsl(206, 81%, 50%)', order: 8 },
        { _id: 'cat-10', name: 'Travel', icon: 'Plane', color: 'hsl(14, 88%, 58%)', order: 9 },
        { _id: 'cat-11', name: 'Accommodation', icon: 'Home', color: 'hsl(130, 71%, 48%)', order: 10 },
        { _id: 'cat-12', name: 'News Subscription', icon: 'Receipt', color: 'hsl(26, 88%, 58%)', order: 11 },
        { _id: 'cat-13', name: 'Software', icon: 'Shapes', color: 'hsl(250, 88%, 58%)', order: 12 },
        { _id: 'cat-14', name: 'Utilities', icon: 'Wifi', color: 'hsl(180, 88%, 58%)', order: 13 },
        { _id: 'cat-15', name: 'Subscriptions', icon: 'Repeat', color: 'hsl(300, 76%, 60%)', order: 14 }
    ],
};

module.exports = { initialData };
