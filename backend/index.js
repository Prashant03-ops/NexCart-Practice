
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// ===============================
// CORS CONFIGURATION
// ===============================

const allowedOrigins = [
    'http://localhost:3000',
    'https://nex-cart-practice.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow Postman, server-to-server and requests without Origin
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log('Blocked CORS origin:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Handle preflight requests
app.options(/.*/, cors({
    origin: allowedOrigins,
    credentials: true
}));

// ===============================
// BODY PARSING MIDDLEWARE
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// HEALTH CHECK ROUTE
// ===============================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'NexCart Backend is working properly'
    });
});

// ===============================
// MONGODB CONNECTION MIDDLEWARE
// ===============================

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

// ===============================
// API ROUTES
// ===============================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoute'));

// ===============================
// UNKNOWN API ROUTE
// ===============================

app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API route not found: ${req.method} ${req.originalUrl}`
    });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
    console.error('Backend error:', err.message);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

// ===============================
// LOCAL DEVELOPMENT SERVER
// ===============================

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

// ===============================
// VERCEL EXPORT
// ===============================

module.exports = app;


