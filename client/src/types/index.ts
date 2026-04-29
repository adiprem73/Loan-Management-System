export type UserRole = 
  | 'borrower' 
  | 'sales' 
  | 'sanction' 
  | 'disbursement' 
  | 'collection' 
  | 'admin';

export type LoanStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'DISBURSED' 
  | 'CLOSED';

export type EmploymentMode = 
  | 'Salaried' 
  | 'Self-Employed' 
  | 'Unemployed';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Loan {
  _id: string;
  borrower: User | string;
  fullName: string;
  pan: string;
  dateOfBirth: string;
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
  sanctionedBy?: User | string;
  disbursedBy?: User | string;
  disbursedAt?: string;
  totalPaid: number;
  outstandingBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  loan: string;
  borrower: User | string;
  utr: string;
  amount: number;
  paymentDate: string;
  recordedBy: User | string;
  createdAt: string;
}

export interface AuditLog {
  _id: string;
  loan: string;
  action: string;
  performedBy: User;
  fromStatus?: string;
  toStatus?: string;
  note?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}