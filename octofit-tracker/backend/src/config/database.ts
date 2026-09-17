import mongoose from 'mongoose';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Connected to octofit_db');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed. Continuing with in-memory demo data.', error);
    return null;
  }
};

export default connectDatabase;
