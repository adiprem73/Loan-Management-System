import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/user.model';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ success: false, message: 'Not authenticated' });

    if (!allowedRoles.includes(req.user.role as UserRole))
      return res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });

    next();
  };
};