import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export type Role = 'ADMIN'|'SALES'|'WAREHOUSE'|'ACCOUNTS';
export interface AuthRequest extends Request { user?: { id: string; role: Role; email: string } }

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined;
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  try { req.user = jwt.verify(token, env.jwtSecret) as AuthRequest['user']; next(); }
  catch { return res.status(401).json({ message: 'Invalid or expired token' }); }
}

export const allowRoles = (...roles: Role[]) => (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: 'Insufficient permissions' });
  next();
};
