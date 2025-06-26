
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MongoDB URI not found. Please set MONGODB_URI in your .env file.");
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully."))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    });

// Routes
app.get('/', (req, res) => {
    res.send('TrackWise Backend Server is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
