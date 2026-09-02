import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);
  if (err instanceof ZodError) return res.status(400).json({ message: 'Validation failed', errors: err.flatten() });
  return res.status(500).json({ message: 'Internal server error' });
}
