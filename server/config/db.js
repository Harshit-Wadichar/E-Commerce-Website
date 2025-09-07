// backend/config/db.js  (CommonJS)
const mongoose = require('mongoose');

const DEFAULT_DBNAME = process.env.MONGODB_DBNAME || process.env.MONGO_DBNAME || 'ecommerce';

const connectDB = async (uri) => {
  const mongoUri = uri || process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('Missing MongoDB URI. Set MONGODB_URI or MONGO_URI in .env');
  }

  mongoose.set('strictQuery', false);

  mongoose.connection.on('connected', () => console.log('MongoDB connected'));
  mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
  mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

  try {
    await mongoose.connect(mongoUri, {
      dbName: DEFAULT_DBNAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message || err);
    throw err;
  }
};

module.exports = connectDB;
