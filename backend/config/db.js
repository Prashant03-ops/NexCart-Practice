
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('MONGO_URI exists:', Boolean(process.env.MONGO_URI));

        console.log(
            'MongoDB hostname:',
            process.env.MONGO_URI
                ? process.env.MONGO_URI.split('@')[1]?.split('/')[0]
                : 'MONGO_URI MISSING'
        );

        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log('MongoDB connected:', conn.connection.host);

        return conn.connection;

    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
};

module.exports = connectDB;
