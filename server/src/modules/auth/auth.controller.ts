import { Request, Response } from 'express';
import * as authService from './auth.service';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const data = await authService.signup(name, email, password);
    res.status(201).json({ success: true, ...data });

  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const data = await authService.login(email, password);
    res.status(200).json({ success: true, ...data });

  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    // req.user is set by auth middleware
    const user = await authService.getMe((req as any).user.id);
    res.status(200).json({ success: true, user });

  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};