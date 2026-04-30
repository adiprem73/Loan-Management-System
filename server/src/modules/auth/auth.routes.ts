import { Router } from 'express';
import * as authController from './auth.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

console.log("aditya prem")
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.get('/users', authController.getAllUsers);
router.get('/test123', (req, res) => {
    res.send('WORKING BRO');
  });
export default router;