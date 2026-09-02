import { Pool, PoolClient } from 'pg';
import { env } from './env';

if (!env.databaseUrl) throw new Error('DATABASE_URL is required');

export const pool = new Pool({ connectionString: env.databaseUrl, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
export const withTransaction = async <T>(fn: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  try { await client.query('BEGIN'); const result = await fn(client); await client.query('COMMIT'); return result; }
  catch (error) { await client.query('ROLLBACK'); throw error; }
  finally { client.release(); }
};
