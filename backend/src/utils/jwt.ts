import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '../middleware/auth';
export const signToken = (payload: { id: string; email: string; role: Role }) => jwt.sign(payload, env.jwtSecret, { expiresIn: '1d' });
