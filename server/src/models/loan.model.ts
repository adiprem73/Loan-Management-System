import mongoose, { Document, Schema } from 'mongoose';

export type LoanStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DISBURSED' | 'CLOSED';
export type EmploymentMode = 'Salaried' | 'Self-Employed' | 'Unemployed';

export interface ILoan extends Document {
  borrower: mongoose.Types.ObjectId;
  fullName: string;
  pan: string;
  dateOfBirth: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl: string;
  amount: number;
  tenure: number;
  interestRate: number;
  simpleInterest: number;
  totalRepayment: number;
  status: LoanStatus;
  rejectionReason?: string;
  sanctionedBy?: mongoose.Types.ObjectId;
  disbursedBy?: mongoose.Types.ObjectId;
  disbursedAt?: Date;
  totalPaid: number;
  outstandingBalance: number;
}

const loanSchema = new Schema<ILoan>(
  {
    borrower:         { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName:         { type: String, required: true },
    pan:              { type: String, required: true },
    dateOfBirth:      { type: Date, required: true },
    monthlySalary:    { type: Number, required: true },
    employmentMode:   { type: String, enum: ['Salaried', 'Self-Employed', 'Unemployed'], required: true },
    salarySlipUrl:    { type: String, required: true },
    amount:           { type: Number, required: true, min: 50000, max: 500000 },
    tenure:           { type: Number, required: true, min: 30, max: 365 },
    interestRate:     { type: Number, default: 12 },
    simpleInterest:   { type: Number, required: true },
    totalRepayment:   { type: Number, required: true },
    status:           { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED', 'DISBURSED', 'CLOSED'], default: 'PENDING' },
    rejectionReason:  { type: String },
    sanctionedBy:     { type: Schema.Types.ObjectId, ref: 'User' },
    disbursedBy:      { type: Schema.Types.ObjectId, ref: 'User' },
    disbursedAt:      { type: Date },
    totalPaid:        { type: Number, default: 0 },
    outstandingBalance: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILoan>('Loan', loanSchema);