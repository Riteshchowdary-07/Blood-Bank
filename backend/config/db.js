const mongoose = require('mongoose');
const logger = require('./logger');

// In-memory data fallback if MongoDB URI is not active
const memoryStore = {
  isFallback: false,
  users: [],
  donors: [],
  patients: [],
  bloodBanks: [],
  hospitals: [],
  inventories: [],
  requests: [],
  donations: [],
  notifications: [],
  reports: [],
  auditLogs: [],
  rewards: []
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lifelink_db';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    logger.info(`MongoDB Connected successfully to ${mongoURI}`);
  } catch (err) {
    logger.warn(`MongoDB Connection failed: ${err.message}. Operating in resilient fallback mode with seeded in-memory store.`);
    memoryStore.isFallback = true;
  }
};

module.exports = { connectDB, memoryStore };
