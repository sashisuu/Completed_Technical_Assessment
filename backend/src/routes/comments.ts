import express from 'express';
import { listComments, countComments } from '../db';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 20);
  const search = (req.query.search || '') as string;
  try {
    const [items, total] = await Promise.all([
      listComments(page, limit, search || undefined),
      countComments(search || undefined)
    ]);
    res.json({ items, total, page, limit });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
