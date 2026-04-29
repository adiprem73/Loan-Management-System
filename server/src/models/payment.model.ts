import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  loan: mongoose.Types.ObjectId;
  borrower: mongoose.Types.ObjectId;
  utr: string;
  amount: number;
  paymentDate: Date;
  recordedBy: mongoose.Types.ObjectId;
}

const paymentSchema = new Schema<IPayment>(
  {
    loan:        { type: Schema.Types.ObjectId, ref: 'Loan', required: true },
    borrower:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
    utr:         { type: String, required: true, unique: true, trim: true },
    amount:      { type: Number, required: true, min: 1 },
    paymentDate: { type: Date, required: true },
    recordedBy:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', paymentSchema);