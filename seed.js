
const mongoose = require('mongoose');
const Role = require('./models/role');
const Category = require('./models/category');
const Member = require('./models/member');
const Transaction = require('./models/transaction');
const Budget = require('./models/budget');
const Trip = require('./models/trip');
const Approval = require('./models/approval');
const Subscription = require('./models/subscription');
const AuditLog = require('./models/auditLog');
const { initialData } = require('./lib/seed-data');

const seedDatabase = async () => {
    // This seeding logic is destructive and should only run in development.
    // It ensures a clean, consistent state every time the server restarts.
    if (process.env.NODE_ENV !== 'production') {
        try {
            console.log('--- Development mode detected: Wiping and resetting database ---');

            // Clear all collections to ensure a clean slate
            await Member.deleteMany({});
            await Transaction.deleteMany({});
            await Budget.deleteMany({});
            await Trip.deleteMany({});
            await Approval.deleteMany({});
            await Subscription.deleteMany({});
            await AuditLog.deleteMany({});
            await Role.deleteMany({});
            await Category.deleteMany({});
            console.log('All collections wiped.');
            
            // Re-seed essential data
            await Role.insertMany(initialData.roles);
            console.log('Roles seeded successfully.');

            await Category.insertMany(initialData.categories);
            console.log('Categories seeded successfully.');

            console.log('--- Database reset complete. ---');

        } catch (error) {
            console.error('Error resetting and seeding database:', error);
            process.exit(1); // Exit if seeding fails, as it's a critical startup step
        }
    } else {
        // In production, you might want a more sophisticated migration strategy.
        // For now, we'll just log that we're not touching the data.
        console.log('Production mode detected. Skipping automatic data reset.');
    }
};

module.exports = seedDatabase;
