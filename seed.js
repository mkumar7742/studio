const mongoose = require('mongoose');
const Account = require('./models/account');
const Category = require('./models/category');
const Member = require('./models/member');
const Role = require('./models/role');
const Transaction = require('./models/transaction');
const Budget = require('./models/budget');
const Trip = require('./models/trip');
const Approval = require('./models/approval');
const Subscription = require('./models/subscription');
const { initialData } = require('./lib/seed-data');

const seedDatabase = async () => {
    try {
        const memberCount = await Member.countDocuments();
        if (memberCount > 0) {
            console.log('Database already seeded. Skipping.');
            return;
        }

        console.log('Empty database detected. Seeding initial data...');

        await Role.insertMany(initialData.roles);
        console.log('Roles seeded.');

        await Member.insertMany(initialData.members);
        console.log('Members seeded.');

        await Account.insertMany(initialData.accounts);
        console.log('Accounts seeded.');

        await Category.insertMany(initialData.categories);
        console.log('Categories seeded.');

        await Transaction.insertMany(initialData.transactions);
        console.log('Transactions seeded.');

        await Budget.insertMany(initialData.budgets);
        console.log('Budgets seeded.');

        await Trip.insertMany(initialData.trips);
        console.log('Trips seeded.');

        await Approval.insertMany(initialData.approvals);
        console.log('Approvals seeded.');

        await Subscription.insertMany(initialData.subscriptions);
        console.log('Subscriptions seeded.');

        console.log('Database seeding completed successfully.');

    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;
