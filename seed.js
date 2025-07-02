
const mongoose = require('mongoose');
const Role = require('./models/role');
const Category = require('./models/category');
const { initialData } = require('./lib/seed-data');

const seedDatabase = async () => {
    try {
        // Seed Roles if they don't exist
        const roleCount = await Role.countDocuments();
        if (roleCount === 0) {
            console.log('No roles found, seeding roles...');
            await Role.insertMany(initialData.roles);
            console.log('Roles seeded.');
        } else {
            console.log('Roles already exist, skipping role seeding.');
        }

        // Seed Categories if they don't exist
        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
            console.log('No categories found, seeding categories...');
            await Category.insertMany(initialData.categories);
            console.log('Categories seeded.');
        } else {
            console.log('Categories already exist, skipping category seeding.');
        }

        console.log('Essential data check complete.');

    } catch (error) {
        console.error('Error seeding database with essential data:', error);
    }
};

module.exports = seedDatabase;
