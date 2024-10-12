const mongoose = require('mongoose');
const { AUTOHR_MONGODB_URI } = require('../constants');

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(AUTOHR_MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectToMongoDB;