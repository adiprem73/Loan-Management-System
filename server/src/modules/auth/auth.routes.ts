import { Router } from 'express';
import * as authController from './auth.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login',  authController.login);
router.get('/me',      protect, authController.getMe); // protected

export default router;