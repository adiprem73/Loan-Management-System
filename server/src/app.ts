import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';

import authRoutes from './modules/auth/auth.routes';
import uploadRoutes from './modules/upload/upload.routes';  // ← add this
import loanRoutes from './modules/loan/loan.routes';
import paymentRoutes from './modules/payment/payment.routes';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
connectDB();

const app = express();

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));  // ← add this

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);  // ← add this
app.use('/api/loans', loanRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;