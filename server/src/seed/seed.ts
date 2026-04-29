import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/user.model';

dotenv.config();

const seeds = [
  { name: 'Admin User',         email: 'admin@lms.com',        password: 'Admin@123',        role: 'admin' },
  { name: 'Sales Executive',    email: 'sales@lms.com',        password: 'Sales@123',        role: 'sales' },
  { name: 'Sanction Executive', email: 'sanction@lms.com',     password: 'Sanction@123',     role: 'sanction' },
  { name: 'Disburse Executive', email: 'disbursement@lms.com', password: 'Disburse@123',     role: 'disbursement' },
  { name: 'Collection Officer', email: 'collection@lms.com',   password: 'Collection@123',   role: 'collection' },
  { name: 'Test Borrower',      email: 'borrower@lms.com',     password: 'Borrower@123',     role: 'borrower' },
] as const;

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log('Connected to DB');

  for (const seed of seeds) {
    const exists = await User.findOne({ email: seed.email });
    if (!exists) {
      await User.create(seed);
      console.log(`✅ Created: ${seed.email}`);
    } else {
      console.log(`⏭️  Already exists: ${seed.email}`);
    }
  }

  await mongoose.disconnect();
  console.log('Done. Disconnected.');
};

run().catch(console.error);