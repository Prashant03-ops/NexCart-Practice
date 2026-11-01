
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check whether MongoDB URI exists
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing in environment variables');
    }

    // Diagnostic logs (password is never printed)
    console.log('MONGO_URI exists:', Boolean(process.env.MONGO_URI));

    const hostname = process.env.MONGO_URI
      .split('@')[1]
      ?.split('/')[0];

    console.log('MongoDB hostname:', hostname || 'Invalid URI');

    // Reuse existing connection
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return mongoose.connection;
    }

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      'MongoDB connected successfully:',
      conn.connection.host
    );

    return conn.connection;

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

module.exports = connectDB;

