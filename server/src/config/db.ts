import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGO_URI as string;
    await mongoose.connect(uri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};