import { Router } from 'express';
import * as authController from './auth.controller';
import { protect } from '../../middleware/auth.middleware';
import { getAllUsers } from './auth.controller';

const router = Router();

console.log("aditya prem")
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.get('/users', authController.getAllUsers);

export default router;