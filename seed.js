
const mongoose = require('mongoose');
const Role = require('./models/role');
const Category = require('./models/category');
const Member = require('./models/member');
const Transaction = require('./models/transaction');
const AuditLog = require('./models/auditLog');
const Approval = require('./models/approval');
const Account = require('./models/account');
const Family = require('./models/family');
const Budget = require('./models/budget');

const seedDatabase = async () => {
    // This seeding logic is destructive and should only run in development.
    // It ensures a clean, consistent state every time the server restarts.
    if (process.env.NODE_ENV !== 'production') {
        try {
            console.log('--- Development mode detected: Wiping and resetting database ---');

            // Clear all collections to ensure a clean slate
            await Member.deleteMany({});
            await Transaction.deleteMany({});
            await AuditLog.deleteMany({});
            await Role.deleteMany({});
            await Category.deleteMany({});
            await Approval.deleteMany({});
            await Account.deleteMany({});
            await Budget.deleteMany({});
            await Family.deleteMany({});
            console.log('All collections wiped.');
            
            // Data is now seeded on-demand via the /api/setup endpoint.
            // This script now only serves to wipe the DB in development.

            console.log('--- Database reset complete. Ready for initial setup via the application UI. ---');

        } catch (error) {
            console.error('Error resetting database:', error);
            process.exit(1); // Exit if wiping fails, as it's a critical startup step
        }
    } else {
        // In production, you might want a more sophisticated migration strategy.
        // For now, we'll just log that we're not touching the data.
        console.log('Production mode detected. Skipping automatic data reset.');
    }
};

module.exports = seedDatabase;
