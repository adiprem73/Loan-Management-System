import { Router } from 'express';
import * as paymentController from './payment.controller';
import { protect } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

// Record a payment for a loan (collection executive only)
router.post(
  '/:loanId',
  protect,
  authorize('admin', 'collection'),
  paymentController.recordPayment
);

// Get all payments for a specific loan
router.get(
  '/:loanId',
  protect,
  authorize('admin', 'collection', 'disbursement', 'sanction'),
  paymentController.getPaymentsByLoan
);

// Get all payments across all loans (admin only)
router.get(
  '/',
  protect,
  authorize('admin', 'collection'),
  paymentController.getAllPayments
);

export default router;