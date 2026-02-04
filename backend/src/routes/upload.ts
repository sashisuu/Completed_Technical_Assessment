import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { parseAndStoreCSV } from '../services/csvParser';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file is required' });

  const path = req.file.path;
  const stream = fs.createReadStream(path);
  try {
    const result = await parseAndStoreCSV(stream);
    fs.unlink(path, () => {});
    return res.json(result);
  } catch (e: any) {
    fs.unlink(path, () => {});
    return res.status(500).json({ error: e.message || 'Parse error' });
  }
});

export default router;
