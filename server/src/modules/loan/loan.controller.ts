import { Request, Response } from 'express';
import * as loanService from './loan.service';

export const applyLoan = async (req: Request, res: Response) => {
  try {
    const loan = await loanService.applyLoan(req.user!.id, req.body);
    res.status(201).json({ success: true, loan });
  } catch (err: any) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }
};

export const getMyLoans = async (req: Request, res: Response) => {
  try {
    const loans = await loanService.getMyLoans(req.user!.id);
    res.status(200).json({ success: true, loans });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllLoans = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const loans = await loanService.getAllLoans(status as string);
    res.status(200).json({ success: true, loans });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLoanById = async (req: Request, res: Response) => {
  try {
    const loan = await loanService.getLoanById(req.params.id as string);
    if (!loan) return res.status(404).json({ success: false, message: 'Loan not found' });
    res.status(200).json({ success: true, loan });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sanctionLoan = async (req: Request, res: Response) => {
  try {
    const { action, rejectionReason } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(action))
      return res.status(400).json({ success: false, message: 'Action must be APPROVED or REJECTED' });

    const loan = await loanService.sanctionLoan(
      req.params.id as string,
      req.user!.id,
      action,
      rejectionReason
    );
    res.status(200).json({ success: true, loan });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const disburseLoan = async (req: Request, res: Response) => {
  try {
    const loan = await loanService.disburseLoan(req.params.id as string, req.user!.id);
    res.status(200).json({ success: true, loan });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

export const getLoanAuditLog = async (req: Request, res: Response) => {
  try {
    const logs = await loanService.getLoanAuditLog(req.params.id as string);
    res.status(200).json({ success: true, logs });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};