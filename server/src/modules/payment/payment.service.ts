import Payment from '../../models/payment.model';
import Loan from '../../models/loan.model';
import AuditLog from '../../models/auditLog.model';

export const recordPayment = async (
  loanId: string,
  executiveId: string,
  data: {
    utr: string;
    amount: number;
    paymentDate: string;
  }
) => {
  const loan = await Loan.findById(loanId);
  if (!loan) throw { status: 404, message: 'Loan not found' };
  if (loan.status !== 'DISBURSED')
    throw { status: 400, message: 'Payments can only be recorded for DISBURSED loans' };

  // Validate amount
  if (data.amount <= 0)
    throw { status: 400, message: 'Payment amount must be greater than 0' };
  if (data.amount > loan.outstandingBalance)
    throw { status: 400, message: `Amount exceeds outstanding balance of ₹${loan.outstandingBalance}` };

  // Check UTR uniqueness
  const existingUTR = await Payment.findOne({ utr: data.utr });
  if (existingUTR)
    throw { status: 400, message: 'UTR number already exists. Each payment must have a unique UTR.' };

  // Record payment
  const payment = await Payment.create({
    loan: loanId,
    borrower: loan.borrower,
    utr: data.utr,
    amount: data.amount,
    paymentDate: new Date(data.paymentDate),
    recordedBy: executiveId,
  });

  // Update loan totals
  loan.totalPaid = loan.totalPaid + data.amount;
  loan.outstandingBalance = loan.outstandingBalance - data.amount;

  // Auto-close if fully paid
  if (loan.outstandingBalance <= 0) {
    loan.outstandingBalance = 0;
    loan.status = 'CLOSED';

    await AuditLog.create({
      loan: loan._id,
      action: 'LOAN_CLOSED',
      performedBy: executiveId,
      fromStatus: 'DISBURSED',
      toStatus: 'CLOSED',
      note: 'Loan fully repaid and auto-closed',
    });
  }

  await loan.save();

  await AuditLog.create({
    loan: loan._id,
    action: 'PAYMENT_RECORDED',
    performedBy: executiveId,
    note: `Payment of ₹${data.amount} recorded. UTR: ${data.utr}`,
  });

  return { payment, loan };
};

export const getPaymentsByLoan = async (loanId: string) => {
  return Payment.find({ loan: loanId })
    .populate('recordedBy', 'name role')
    .sort({ createdAt: -1 });
};

export const getAllPayments = async () => {
  return Payment.find()
    .populate('loan', 'amount totalRepayment status')
    .populate('borrower', 'name email')
    .populate('recordedBy', 'name role')
    .sort({ createdAt: -1 });
};