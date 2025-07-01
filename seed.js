
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
        // To ensure a clean state in development, we'll wipe the collections first.
        // This is useful if seed data or schemas change.
        // This check prevents it from running in a real production environment.
        if (process.env.NODE_ENV !== 'production') {
            console.log('Development environment detected. Clearing database for fresh seed...');
            const collections = mongoose.connection.collections;
            // Await all deletions to complete before proceeding
            await Promise.all(Object.values(collections).map(collection => {
                if (collection.collectionName !== 'system.views') {
                   return collection.deleteMany({});
                }
                return Promise.resolve();
            }));
            console.log('Database cleared.');
        } else {
             const memberCount = await Member.countDocuments();
             if (memberCount > 0) {
                console.log('Production environment already seeded. Skipping.');
                return;
             }
        }

        console.log('Seeding initial data...');

        await Role.insertMany(initialData.roles);
        console.log('Roles seeded.');
        
        // Use create instead of insertMany to trigger the 'save' hook for password hashing
        for (const memberData of initialData.members) {
            await Member.create(memberData);
        }
        console.log('Members seeded and passwords hashed.');

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
