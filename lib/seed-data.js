
const mongoose = require('mongoose');

const initialData = {
    roles: [
        {
            name: 'Administrator',
            permissions: [
              'dashboard:view',
              'expenses:view', 'expenses:create', 'expenses:edit', 'expenses:delete',
              'income:view', 'income:create', 'income:edit', 'income:delete',
              'categories:view', 'categories:create', 'categories:edit', 'categories:delete',
              'members:view', 'members:create', 'members:edit', 'members:delete',
              'roles:manage',
              'calendar:view',
              'audit:view',
            ],
        },
        {
            name: 'Manager',
            permissions: [
              'dashboard:view',
              'expenses:view', 'expenses:create', 'expenses:edit',
              'income:view', 'income:create', 'income:edit',
              'categories:view',
              'members:view',
              'calendar:view',
            ],
        },
        {
            name: 'Member',
            permissions: [
              'dashboard:view',
              'expenses:view', 'expenses:create',
              'income:view', 'income:create',
              'calendar:view',
            ],
        },
    ],
    categories: [
        { name: 'Income', icon: 'Briefcase', color: 'hsl(var(--chart-1))', order: 0 },
        { name: 'Rent', icon: 'Landmark', color: 'hsl(var(--chart-2))', order: 1 },
        { name: 'Food', icon: 'UtensilsCrossed', color: 'hsl(var(--chart-3))', order: 2 },
        { name: 'Shopping', icon: 'ShoppingCart', color: 'hsl(var(--chart-4))', order: 3 },
        { name: 'Health', icon: 'HeartPulse', color: 'hsl(var(--chart-5))', order: 4 },
        { name: 'Transport', icon: 'Car', color: 'hsl(var(--chart-1))', order: 5 },
        { name: 'Education', icon: 'GraduationCap', color: 'hsl(var(--chart-2))', order: 6 },
        { name: 'Entertainment', icon: 'Film', color: 'hsl(var(--chart-3))', order: 7 },
        { name: 'Supplies', icon: 'PenSquare', color: 'hsl(206, 81%, 50%)', order: 8 },
        { name: 'Travel', icon: 'Plane', color: 'hsl(14, 88%, 58%)', order: 9 },
        { name: 'Accommodation', icon: 'Home', color: 'hsl(130, 71%, 48%)', order: 10 },
        { name: 'News Subscription', icon: 'Receipt', color: 'hsl(26, 88%, 58%)', order: 11 },
        { name: 'Software', icon: 'Shapes', color: 'hsl(250, 88%, 58%)', order: 12 },
        { name: 'Utilities', icon: 'Wifi', color: 'hsl(180, 88%, 58%)', order: 13 },
        { name: 'Subscriptions', icon: 'Repeat', color: 'hsl(300, 76%, 60%)', order: 14 }
    ],
};

module.exports = { initialData };
