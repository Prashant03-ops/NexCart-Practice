
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://nex-cart-practice.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests without an Origin header (e.g. Postman)
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'NexCart Backend is working properly'
    });
});

// Connect MongoDB before API requests
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('MongoDB connection error:', error.message);

        res.status(503).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoute'));

// Handle unknown API routes
app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API route not found: ${req.method} ${req.originalUrl}`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Backend error:', err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// Local development
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`NexCart server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Database connection failed:', error.message);
            process.exit(1);
        });
}

// Vercel serverless export
module.exports = app;

