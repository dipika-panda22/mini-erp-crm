import { Response } from 'express';
import { z } from 'zod';
import { pool } from '../config/db';
import { AuthRequest } from '../middleware/auth';

const schema = z.object({ name:z.string().min(1), mobile:z.string().min(5), email:z.string().email().optional().or(z.literal('')), business_name:z.string().optional(), gst_number:z.string().optional(), customer_type:z.enum(['RETAIL','WHOLESALE','DISTRIBUTOR']), address:z.string().min(1), status:z.enum(['LEAD','ACTIVE','INACTIVE']).default('LEAD'), follow_up_date:z.string().optional(), notes:z.string().optional() });
export async function listCustomers(req: AuthRequest,res: Response){ const page=Math.max(1,Number(req.query.page??1)); const limit=Math.min(100,Math.max(1,Number(req.query.limit??10))); const q=String(req.query.search??''); const offset=(page-1)*limit; const params=[`%${q}%`,limit,offset]; const data=await pool.query(`SELECT * FROM customers WHERE name ILIKE $1 OR mobile ILIKE $1 OR COALESCE(business_name,'') ILIKE $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,params); const count=await pool.query(`SELECT COUNT(*)::int AS count FROM customers WHERE name ILIKE $1 OR mobile ILIKE $1 OR COALESCE(business_name,'') ILIKE $1`,[params[0]]); res.json({data:data.rows,pagination:{page,limit,total:count.rows[0].count}}); }
export async function createCustomer(req: AuthRequest,res: Response){ const d=schema.parse(req.body); const r=await pool.query(`INSERT INTO customers(name,mobile,email,business_name,gst_number,customer_type,address,status,follow_up_date,notes) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,[d.name,d.mobile,d.email||null,d.business_name||null,d.gst_number||null,d.customer_type,d.address,d.status,d.follow_up_date||null,d.notes||null]); res.status(201).json(r.rows[0]); }
export async function getCustomer(req: AuthRequest,res: Response){ const r=await pool.query('SELECT * FROM customers WHERE id=$1',[req.params.id]); if(!r.rows[0]) return res.status(404).json({message:'Customer not found'}); const f=await pool.query('SELECT * FROM customer_followups WHERE customer_id=$1 ORDER BY created_at DESC',[req.params.id]); res.json({...r.rows[0],followups:f.rows}); }
export async function updateCustomer(
  req: AuthRequest,
  res: Response
) {
  const id = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  if (!id) {
    return res.status(400).json({
      message: 'Customer ID is required'
    });
  }

  const d = schema.partial().parse(req.body);

  const fields = Object.entries(d);

  if (!fields.length) {
    return res.status(400).json({
      message: 'Nothing to update'
    });
  }

  const sets = fields
    .map(([key], index) => `${key}=$${index + 1}`)
    .join(',');

  const values = fields.map(([, value]) => value);

  values.push(id);

  const result = await pool.query(
    `UPDATE customers
     SET ${sets}, updated_at=NOW()
     WHERE id=$${values.length}
     RETURNING *`,
    values
  );

  if (!result.rows[0]) {
    return res.status(404).json({
      message: 'Customer not found'
    });
  }

  res.json(result.rows[0]);
}
export async function addFollowup(req: AuthRequest,res: Response){ const d=z.object({note:z.string().min(1),follow_up_date:z.string().optional()}).parse(req.body); const r=await pool.query('INSERT INTO customer_followups(customer_id,note,follow_up_date,created_by) VALUES($1,$2,$3,$4) RETURNING *',[req.params.id,d.note,d.follow_up_date||null,req.user!.id]); await pool.query('UPDATE customers SET follow_up_date=COALESCE($1,follow_up_date), updated_at=NOW() WHERE id=$2',[d.follow_up_date||null,req.params.id]); res.status(201).json(r.rows[0]); }
