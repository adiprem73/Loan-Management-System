import { Request, Response } from 'express';
import * as paymentService from './payment.service';

export const recordPayment = async (req: Request, res: Response) => {
  try {
    const { utr, amount, paymentDate } = req.body;

    if (!utr || !amount || !paymentDate)
      return res.status(400).json({ success: false, message: 'UTR, amount and paymentDate are required' });

    const result = await paymentService.recordPayment(
      req.params.loanId as string,
      req.user!.id,
      { utr, amount, paymentDate }
    );

    res.status(201).json({
      success: true,
      message: result.loan.status === 'CLOSED'
        ? '🎉 Payment recorded. Loan fully repaid and closed!'
        : 'Payment recorded successfully',
      payment: result.payment,
      updatedLoan: {
        status: result.loan.status,
        totalPaid: result.loan.totalPaid,
        outstandingBalance: result.loan.outstandingBalance,
      },
    });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const getPaymentsByLoan = async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.getPaymentsByLoan(req.params.loanId as string);
    res.status(200).json({ success: true, payments });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({ success: true, payments });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};