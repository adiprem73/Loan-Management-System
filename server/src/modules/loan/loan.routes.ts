import { Router } from 'express';
import * as loanController from './loan.controller';
import { protect } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

// Borrower routes
router.post('/',         protect, authorize('borrower'),                              loanController.applyLoan);
router.get('/my-loans',  protect, authorize('borrower'),                              loanController.getMyLoans);

// Executive + Admin routes
router.get('/',          protect, authorize('admin', 'sales', 'sanction', 'disbursement', 'collection'), loanController.getAllLoans);
router.get('/:id',       protect, authorize('admin', 'sales', 'sanction', 'disbursement', 'collection', 'borrower'), loanController.getLoanById);
router.get('/:id/audit', protect, authorize('admin', 'sanction', 'disbursement', 'collection'),          loanController.getLoanAuditLog);

// Sanction executive
router.patch('/:id/sanction',   protect, authorize('admin', 'sanction'),     loanController.sanctionLoan);

// Disbursement executive
router.patch('/:id/disburse',   protect, authorize('admin', 'disbursement'), loanController.disburseLoan);

export default router;