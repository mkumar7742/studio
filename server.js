
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const seedDatabase = require('./seed');

const app = express();
const PORT = process.env.PORT || 5001;

// --- MIDDLEWARE SETUP ---
app.use(helmet()); // Basic security headers

const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from your Next.js frontend
    optionsSuccessStatus: 200
};
app.options('*', cors(corsOptions)); // Enable pre-flight requests for all routes
app.use(cors(corsOptions));
app.use(express.json());


// --- RATE LIMITING ---
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
});
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 20 login requests per window
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
    standardHeaders: true,
	legacyHeaders: false,
});

// Apply the general limiter to all API routes
app.use('/api/', apiLimiter);


// --- API ROUTES ---
app.use('/api/auth', loginLimiter, require('./api/auth'));
app.use('/api/setup', require('./api/setup'));
app.use('/api/transactions', require('./api/transactions'));
app.use('/api/accounts', require('./api/accounts'));
app.use('/api/categories', require('./api/categories'));
app.use('/api/members', require('./api/members'));
app.use('/api/roles', require('./api/roles'));
app.use('/api/permissions', require('./api/permissions'));
app.use('/api/audit', require('./api/audit'));
app.use('/api/approvals', require('./api/approvals'));
app.use('/api/families', require('./api/families'));

app.get('/', (req, res) => {
    res.send('TrackWise API Server is running.');
});


// --- SERVER STARTUP ---
const startServer = async () => {
    const dbURI = process.env.MONGODB_URI;

    if (!dbURI || !(dbURI.startsWith('mongodb://') || dbURI.startsWith('mongodb+srv://'))) {
        console.error('---');
        console.error('FATAL ERROR: Invalid or missing MongoDB connection string.');
        console.error('The MONGODB_URI environment variable is not set correctly.');
        console.error('Please add it to your .env file and restart the server.');
        console.error('Example (Local): MONGODB_URI="mongodb://127.0.0.1:27017/trackwise"');
        console.error('Example (Atlas): MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/dbname"');
        console.error('---');
        // Do not proceed to start the server without a valid URI
        return;
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbURI);
        console.log('MongoDB connected successfully.');

        console.log('---');
        console.log('Running development database wipe if needed...');
        await seedDatabase();
        console.log('Database initialization complete.');
        console.log('---');

        app.listen(PORT, () => {
            console.log(`Server is running and listening on port ${PORT}.`);
            console.log('API is ready to accept connections.');
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1); // Exit with a failure code
    }
};

startServer();
