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
              'subscriptions:view',
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
              'subscriptions:view',
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
              'subscriptions:view',
            ],
        },
    ],
    members: [
        { 
          _id: new mongoose.Types.ObjectId(),
          id: 'mem1', 
          name: 'Janice Chandler', 
          email: 'janice.chandler@example.com', 
          roleId: 'role-admin', 
          avatar: 'https://placehold.co/100x100.png', 
          avatarHint: 'person portrait',
          phone: '123-456-7890',
          address: '123 Finance Avenue, Suite 100, Budgetown, 54321',
          socials: [
            { platform: 'Twitter', url: 'https://twitter.com/janicec' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/janicechandler' }
          ]
        },
        { 
          _id: new mongoose.Types.ObjectId(),
          id: 'mem2', 
          name: 'John Doe', 
          email: 'john.doe@example.com', 
          roleId: 'role-manager', 
          avatar: 'https://placehold.co/100x100.png', 
          avatarHint: 'man portrait',
          phone: '234-567-8901',
          address: '456 Expense Lane, Cash City, 98765',
          socials: [
            { platform: 'Twitter', url: 'https://twitter.com/johndoe' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe' }
          ]
        },
        { 
          _id: new mongoose.Types.ObjectId(),
          id: 'mem3', 
          name: 'Jane Smith', 
          email: 'jane.smith@example.com', 
          roleId: 'role-member', 
          avatar: 'https://placehold.co/100x100.png', 
          avatarHint: 'woman portrait',
          phone: '345-678-9012',
          address: '789 Ledger Road, Accountsville, 12345',
          socials: [
            { platform: 'Twitter', url: 'https://twitter.com/janesmith' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/janesmith' }
          ]
        },
    ],
    accounts: [
        { _id: 'acc1', name: 'Checking Account', balance: 4890.72, currency: 'USD', icon: 'Wallet' },
        { _id: 'acc2', name: 'Savings Account', balance: 12540.15, currency: 'USD', icon: 'PiggyBank' },
        { _id: 'acc3', name: 'Credit Card', balance: -784.21, currency: 'USD', icon: 'CreditCard' },
    ],
    categories: [
        { id: 'cat-1', name: 'Income', icon: 'Briefcase', color: 'hsl(var(--chart-1))', order: 0 },
        { id: 'cat-2', name: 'Rent', icon: 'Landmark', color: 'hsl(var(--chart-2))', order: 1 },
        { id: 'cat-3', name: 'Food', icon: 'UtensilsCrossed', color: 'hsl(var(--chart-3))', order: 2 },
        { id: 'cat-4', name: 'Shopping', icon: 'ShoppingCart', color: 'hsl(var(--chart-4))', order: 3 },
        { id: 'cat-5', name: 'Health', icon: 'HeartPulse', color: 'hsl(var(--chart-5))', order: 4 },
        { id: 'cat-6', name: 'Transport', icon: 'Car', color: 'hsl(var(--chart-1))', order: 5 },
        { id: 'cat-7', name: 'Education', icon: 'GraduationCap', color: 'hsl(var(--chart-2))', order: 6 },
        { id: 'cat-8', name: 'Entertainment', icon: 'Film', color: 'hsl(var(--chart-3))', order: 7 },
        { id: 'cat-9', name: 'Supplies', icon: 'PenSquare', color: 'hsl(206, 81%, 50%)', order: 8 },
        { id: 'cat-10', name: 'Travel', icon: 'Plane', color: 'hsl(14, 88%, 58%)', order: 9 },
        { id: 'cat-11', name: 'Accommodation', icon: 'Home', color: 'hsl(130, 71%, 48%)', order: 10 },
        { id: 'cat-12', name: 'News Subscription', icon: 'Receipt', color: 'hsl(26, 88%, 58%)', order: 11 },
        { id: 'cat-13', name: 'Software', icon: 'Shapes', color: 'hsl(250, 88%, 58%)', order: 12 },
        { id: 'cat-14', name: 'Utilities', icon: 'Wifi', color: 'hsl(180, 88%, 58%)', order: 13 },
        { id: 'cat-15', name: 'Subscriptions', icon: 'Repeat', color: 'hsl(300, 76%, 60%)', order: 14 }
    ],
    transactions: [
        { id: 'txn1', type: 'expense', category: 'Food', description: 'Food Catering', amount: 270.00, currency: 'USD', date: '2022-11-09', accountId: 'acc3', receiptUrl: null, member: 'Janice Chandler', team: 'Marketing', merchant: 'McFood', report: 'November_2022', status: 'Not Submitted', reimbursable: true },
        { id: 'txn2', type: 'expense', category: 'Supplies', description: 'Office Supplies', amount: 150.00, currency: 'EUR', date: '2022-11-10', accountId: 'acc3', receiptUrl: null, member: 'John Doe', team: 'Operations', merchant: 'Officio', report: 'November_2022', status: 'Submitted', reimbursable: true },
        { id: 'txn3', type: 'expense', category: 'Food', description: 'Business Lunch', amount: 75.50, currency: 'EUR', date: '2022-11-11', accountId: 'acc1', receiptUrl: null, member: 'Jane Smith', team: 'Marketing', merchant: 'Restaurant', report: 'November_2022', status: 'Reimbursed', reimbursable: true },
        { id: 'txn4', type: 'expense', category: 'Travel', description: 'Travel Expenses', amount: 450.25, currency: 'EUR', date: '2022-11-11', accountId: 'acc3', receiptUrl: null, member: 'Janice Chandler', team: 'Finance', merchant: 'Airlines', report: 'November_2022', status: 'Submitted', reimbursable: false },
        { id: 'txn5', type: 'expense', category: 'Food', description: 'Client Dinner', amount: 120.00, currency: 'EUR', date: '2022-11-12', accountId: 'acc1', receiptUrl: null, member: 'John Doe', team: 'Marketing', merchant: 'Bistro', report: 'November_2022', status: 'Not Submitted', reimbursable: false },
        { id: 'txn6', type: 'expense', category: 'Accommodation', description: 'Accommodation', amount: 275.75, currency: 'EUR', date: '2022-11-16', accountId: 'acc1', receiptUrl: null, member: 'Jane Smith', team: 'Operations', merchant: 'Hotel ***', report: 'November_2022', status: 'Submitted', reimbursable: true },
        { id: 'txn7', type: 'expense', category: 'News Subscription', description: 'News Subscription', amount: 30.00, currency: 'EUR', date: '2022-11-20', accountId: 'acc3', receiptUrl: null, member: 'Janice Chandler', team: 'Finance', merchant: 'NewsTimes', report: 'November_2022', status: 'Not Submitted', isRecurring: true, recurrenceFrequency: 'monthly', reimbursable: false },
        { id: 'txn8', type: 'income', category: 'Income', description: 'Client Project Payment', amount: 3500.00, currency: 'EUR', date: '2022-11-01', accountId: 'acc1', receiptUrl: null, member: 'Janice Chandler', team: 'Finance', merchant: 'Client Inc.', report: 'November_2022', status: 'Submitted', reimbursable: false },
        { id: 'txn9', type: 'income', category: 'Income', description: 'Monthly Salary', amount: 5000.00, currency: 'EUR', date: '2022-11-25', accountId: 'acc2', receiptUrl: null, member: 'John Doe', team: 'Personal', merchant: 'Employer Corp.', report: 'November_2022', status: 'Submitted', isRecurring: true, recurrenceFrequency: 'monthly', reimbursable: false },
    ],
    subscriptions: [
        { id: 'sub1', name: 'Netflix', icon: 'Clapperboard', amount: 15.49, currency: 'USD', billingCycle: 'Monthly', nextPaymentDate: '2024-07-15', category: 'Entertainment' },
        { id: 'sub2', name: 'Spotify Premium', icon: 'Music', amount: 10.99, currency: 'USD', billingCycle: 'Monthly', nextPaymentDate: '2024-07-22', category: 'Entertainment' },
        { id: 'sub3', name: 'iCloud+', icon: 'Cloud', amount: 2.99, currency: 'USD', billingCycle: 'Monthly', nextPaymentDate: '2024-07-28', category: 'Utilities' },
        { id: 'sub4', name: 'Adobe Creative Cloud', icon: 'Sparkles', amount: 599.88, currency: 'USD', billingCycle: 'Yearly', nextPaymentDate: '2025-01-10', category: 'Software' },
    ],
    budgets: [
        { id: 'bud1', name: 'Global Food Budget', category: 'Food', allocated: 500, currency: 'USD', scope: 'global', month: new Date().getMonth(), year: new Date().getFullYear(), status: 'active' },
        { id: 'bud2', name: 'Global Shopping', category: 'Shopping', allocated: 300, currency: 'USD', scope: 'global', month: new Date().getMonth(), year: new Date().getFullYear(), status: 'active' },
        { id: 'bud3', name: 'Jane\'s Travel Budget', category: 'Travel', allocated: 800, currency: 'USD', scope: 'member', memberId: 'mem3', month: new Date().getMonth(), year: new Date().getFullYear(), status: 'active' },
        { id: 'bud4', name: 'John\'s Supplies Budget', category: 'Supplies', allocated: 200, currency: 'USD', scope: 'member', memberId: 'mem2', month: new Date().getMonth(), year: new Date().getFullYear(), status: 'archived' },
    ],
    trips: [
        { id: 'trip1', departDate: '2022-11-08', returnDate: '2022-11-15', location: 'Copenhagen', purpose: 'Business Trip', amount: 1000.00, currency: 'EUR', report: 'November_2022', status: 'Approved', memberId: 'mem1' },
        { id: 'trip2', departDate: '2022-11-10', returnDate: '2022-11-18', location: 'London', purpose: 'Client Pitch', amount: 850.00, currency: 'GBP', report: 'November_2022', status: 'Pending', memberId: 'mem2' },
        { id: 'trip3', departDate: '2022-11-11', returnDate: '2022-11-20', location: 'Brussels', purpose: 'Client Pitch', amount: 1500.00, currency: 'EUR', report: 'November_2022', status: 'Approved', memberId: 'mem3' },
        { id: 'trip4', departDate: '2022-11-11', returnDate: '2022-11-14', location: 'Barcelona', purpose: 'Conference', amount: 2000.00, currency: 'EUR', report: 'November_2022', status: 'Approved', memberId: 'mem1' },
        { id: 'trip5', departDate: '2022-11-12', returnDate: '2022-11-19', location: 'Hamburg', purpose: 'Business Trip', amount: 980.00, currency: 'EUR', report: 'November_2022', status: 'Not Approved', memberId: 'mem3' },
    ],
    approvals: [
        { id: 'appr1', owner: { name: 'Samson Zap', title: 'Engineer', avatar: 'https://placehold.co/40x40.png', avatarHint: 'man portrait' }, category: 'Travel', amount: 780.00, currency: 'EUR', frequency: 'Once', project: 'Client Design', description: "Travel to client's HQ for pitch presentation.", team: 'Websites', status: 'Pending' },
        { id: 'appr2', owner: { name: 'Jessica Bowers', title: 'Designer', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait' }, category: 'Travel', amount: 430.00, currency: 'EUR', frequency: 'Once', project: 'Internal Workshop', description: 'Travel for company-wide design workshop.', team: 'Design', status: 'Pending' },
        { id: 'appr3', owner: { name: 'John Wilson', title: 'Account Executive', avatar: 'https://placehold.co/40x40.png', avatarHint: 'man portrait' }, category: 'Food', amount: 95.50, currency: 'EUR', frequency: 'Monthly', project: 'Client Lunch', description: 'Monthly recurring client lunch.', team: 'Sales', status: 'Pending' },
        { id: 'appr4', owner: { name: 'Hannah Gomez', title: 'Product Manager', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait' }, category: 'Travel', amount: 560.00, currency: 'USD', frequency: 'Monthly', project: 'User Research', description: 'Travel for on-site user research.', team: 'Product', status: 'Pending' },
        { id: 'appr5', owner: { name: 'Laura Polis', title: 'Designer', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait' }, category: 'Software', amount: 120.00, currency: 'EUR', frequency: 'Bi-Monthly', project: 'Design Tools', description: 'Subscription for new design software.', team: 'Design', status: 'Pending' },
        { id: 'appr6', owner: { name: 'Barbara Jones', title: 'Strategist', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait' }, category: 'Software', amount: 275.75, currency: 'EUR', frequency: 'Bi-Monthly', project: 'Analytics Platform', description: 'Subscription for marketing analytics tool.', team: 'Marketing', status: 'Pending' },
        { id: 'appr7', owner: { name: 'Zach Moss', title: 'Engineer', avatar: 'https://placehold.co/40x40.png', avatarHint: 'man portrait' }, category: 'Travel', amount: 30.00, currency: 'EUR', frequency: 'Monthly', project: 'Team Offsite', description: 'Monthly travel budget for team events.', team: 'Engineering', status: 'Pending' },
    ]
};

module.exports = { initialData };
