import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { pool } from '../config/db';
import { signToken } from '../utils/jwt';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function login(req: Request, res: Response) {
  const data = loginSchema.parse(req.body);

  const { rows } = await pool.query(
    'SELECT id, name, email, password_hash, role FROM users WHERE email=$1',
    [data.email.toLowerCase()]
  );

  if (
    !rows[0] ||
    !(await bcrypt.compare(data.password, rows[0].password_hash))
  ) {
    return res.status(401).json({
      message: 'Invalid email or password'
    });
  }

  const user = rows[0];

  return res.json({
    token: signToken({
      id: user.id,
      email: user.email,
      role: user.role
    }),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}