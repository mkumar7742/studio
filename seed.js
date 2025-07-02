
const mongoose = require('mongoose');
const Role = require('./models/role');
const Category = require('./models/category');
const { initialData } = require('./lib/seed-data');

const seedDatabase = async () => {
    // This seeding logic is destructive and should only run in development.
    // It ensures a clean, consistent state every time the server restarts.
    if (process.env.NODE_ENV !== 'production') {
        try {
            console.log('--- Development mode detected: Resetting essential data ---');
            
            // Clear and re-seed Roles
            await Role.deleteMany({});
            await Role.insertMany(initialData.roles);
            console.log('Roles seeded successfully.');

            // Clear and re-seed Categories
            await Category.deleteMany({});
            await Category.insertMany(initialData.categories);
            console.log('Categories seeded successfully.');

            console.log('--- Essential data reset complete. ---');

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
