import Loan from '../../models/loan.model';
import AuditLog from '../../models/auditLog.model';
import { runBRE } from '../../engine/bre.engine';
import { calculateLoan } from '../../utils/loanMath';

export const applyLoan = async (borrowerId: string, data: {
  fullName: string;
  pan: string;
  dateOfBirth: string;
  monthlySalary: number;
  employmentMode: 'Salaried' | 'Self-Employed' | 'Unemployed';
  salarySlipUrl: string;
  amount: number;
  tenure: number;
}) => {
  // Run BRE first
  const bre = runBRE({
    dateOfBirth: data.dateOfBirth,
    monthlySalary: data.monthlySalary,
    employmentMode: data.employmentMode,
    pan: data.pan,
  });

  if (!bre.passed) {
    throw { status: 422, message: 'BRE check failed', errors: bre.errors };
  }

  // Calculate loan math
  const calc = calculateLoan(data.amount, data.tenure);

  const loan = await Loan.create({
    borrower: borrowerId,
    ...data,
    pan: data.pan.toUpperCase(),
    interestRate: calc.interestRate,
    simpleInterest: calc.simpleInterest,
    totalRepayment: calc.totalRepayment,
    outstandingBalance: calc.totalRepayment,
    status: 'PENDING',
  });

  await AuditLog.create({
    loan: loan._id,
    action: 'LOAN_APPLIED',
    performedBy: borrowerId,
    toStatus: 'PENDING',
  });

  return loan;
};

export const getMyLoans = async (borrowerId: string) => {
  return Loan.find({ borrower: borrowerId }).sort({ createdAt: -1 });
};

export const getAllLoans = async (status?: string) => {
    const filter: Record<string, any> = {};
    if (status) filter.status = status;
    return Loan.find(filter)
      .populate('borrower', 'name email')
      .sort({ createdAt: -1 });
  };

export const getLoanById = async (loanId: string) => {
  return Loan.findById(loanId)
    .populate('borrower', 'name email')
    .populate('sanctionedBy', 'name email')
    .populate('disbursedBy', 'name email');
};

export const sanctionLoan = async (
  loanId: string,
  executiveId: string,
  action: 'APPROVED' | 'REJECTED',
  rejectionReason?: string
) => {
  const loan = await Loan.findById(loanId);
  if (!loan) throw { status: 404, message: 'Loan not found' };
  if (loan.status !== 'PENDING') throw { status: 400, message: `Loan is already ${loan.status}` };

  const fromStatus = loan.status;
  loan.status = action;
  loan.sanctionedBy = executiveId as any;
  if (action === 'REJECTED' && rejectionReason) loan.rejectionReason = rejectionReason;
  await loan.save();

  await AuditLog.create({
    loan: loan._id,
    action: action === 'APPROVED' ? 'LOAN_APPROVED' : 'LOAN_REJECTED',
    performedBy: executiveId,
    fromStatus,
    toStatus: action,
    note: rejectionReason,
  });

  return loan;
};

export const disburseLoan = async (loanId: string, executiveId: string) => {
  const loan = await Loan.findById(loanId);
  if (!loan) throw { status: 404, message: 'Loan not found' };
  if (loan.status !== 'APPROVED') throw { status: 400, message: `Loan must be APPROVED before disbursement` };

  loan.status = 'DISBURSED';
  loan.disbursedBy = executiveId as any;
  loan.disbursedAt = new Date();
  await loan.save();

  await AuditLog.create({
    loan: loan._id,
    action: 'LOAN_DISBURSED',
    performedBy: executiveId,
    fromStatus: 'APPROVED',
    toStatus: 'DISBURSED',
  });

  return loan;
};

export const getLoanAuditLog = async (loanId: string) => {
  return AuditLog.find({ loan: loanId })
    .populate('performedBy', 'name role')
    .sort({ createdAt: 1 });
};