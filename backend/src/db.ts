import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/app_db';

export const pool = new Pool({ connectionString });

export async function insertComment(comment: { id: number; postId: number; name: string; email: string; body: string; }) {
  const { id, postId, name, email, body } = comment;
  const res = await pool.query(
    `INSERT INTO comments (id, postId, name, email, body) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (id) DO NOTHING`,
    [id, postId, name, email, body]
  );
  return res.rowCount;
}

export async function countComments(filter?: string) {
  if (!filter) {
    const r = await pool.query('SELECT COUNT(*) FROM comments');
    return Number(r.rows[0].count);
  }
  const r = await pool.query(`SELECT COUNT(*) FROM comments WHERE name ILIKE $1 OR email ILIKE $1 OR body ILIKE $1`, [`%${filter}%`]);
  return Number(r.rows[0].count);
}

export async function listComments(page = 1, limit = 20, filter?: string) {
  const offset = (page - 1) * limit;
  if (!filter) {
    const r = await pool.query('SELECT * FROM comments ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
    return r.rows;
  }
  const q = `%${filter}%`;
  const r = await pool.query('SELECT * FROM comments WHERE name ILIKE $1 OR email ILIKE $1 OR body ILIKE $1 ORDER BY id LIMIT $2 OFFSET $3', [q, limit, offset]);
  return r.rows;
}
