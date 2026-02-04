import { parseCSV } from '../services/csvParser';
import fs from 'fs';
import path from 'path';

function streamFromFile(name: string) {
  return fs.createReadStream(path.join(__dirname, '__fixtures__', name));
}

describe('CSV Parser', () => {
  test('parses valid CSV and returns rows', async () => {
    const stream = streamFromFile('valid.csv');
    const res = await parseCSV(stream);
    expect(res.errors.length).toBe(0);
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].email).toBe('test@example.com');
  });

  test('handles invalid rows', async () => {
    const stream = streamFromFile('invalid.csv');
    const res = await parseCSV(stream);
    expect(res.errors.length).toBeGreaterThan(0);
    expect(res.rows.length).toBe(0);
  });

  test('empty csv yields no rows', async () => {
    const stream = streamFromFile('empty.csv');
    const res = await parseCSV(stream);
    expect(res.rows.length).toBe(0);
    expect(res.errors.length).toBe(0);
  });
});
