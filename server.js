
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const seedDatabase = require('./seed');

const app = express();
const PORT = process.env.PORT || 5001;

// Basic security headers
app.use(helmet());

// Middleware
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from your Next.js frontend
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
const dbURI = process.env.MONGODB_URI;

if (!dbURI || !(dbURI.startsWith('mongodb://') || dbURI.startsWith('mongodb+srv://'))) {
    console.error('---');
    console.error('FATAL ERROR: Invalid or missing MongoDB connection string.');
    console.error('The MONGODB_URI environment variable is not set correctly.');
    console.error('Please add it to your .env file.');
    console.error('Example (Local): MONGODB_URI="mongodb://127.0.0.1:27017/trackwise"');
    console.error('Example (Atlas): MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/dbname"');
    console.error('---');
    // We don't exit the process to allow nodemon to restart on .env file changes
} else {
    mongoose.connect(dbURI)
        .then(async () => {
            console.log('MongoDB connected successfully');
            console.log('---');
            console.log('NOTE: If this is the first run against an empty database,');
            console.log('it will be automatically seeded with initial data.');
            console.log('---');
            await seedDatabase();
        })
        .catch(err => {
            console.error('MongoDB connection error:', err);
        });
}

// Rate limiter for login attempts
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 20 login requests per windowMs
	standardHeaders: true,
	legacyHeaders: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
});


// API Routes
app.use('/api/auth', loginLimiter, require('./api/auth'));
app.use('/api/transactions', require('./api/transactions'));
app.use('/api/accounts', require('./api/accounts'));
app.use('/api/categories', require('./api/categories'));
app.use('/api/budgets', require('./api/budgets'));
app.use('/api/trips', require('./api/trips'));
app.use('/api/approvals', require('./api/approvals'));
app.use('/api/members', require('./api/members'));
app.use('/api/roles', require('./api/roles'));
app.use('/api/subscriptions', require('./api/subscriptions'));
app.use('/api/permissions', require('./api/permissions'));
app.use('/api/audit', require('./api/audit'));

app.get('/', (req, res) => {
    res.send('TrackWise API Server is running.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
