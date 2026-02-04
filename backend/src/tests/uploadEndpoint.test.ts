import request from 'supertest';
import app from '../app'; // Change: Import from app.ts, not index.ts
import path from 'path';
import * as db from '../db';

// Mock the database call
const insertMock = jest.spyOn(db, 'insertComment').mockImplementation(async () => 1 as any);

describe('Upload endpoint', () => {
  
  // Clean up mocks after each test to prevent side effects
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Optional: If your db.ts has an active connection pool, close it here
  // afterAll(async () => {
  //   await db.pool.end(); 
  // });

  test('uploads a CSV and returns insert summary', async () => {
    const filePath = path.join(__dirname, '__fixtures__', 'valid.csv');
    
    const res = await request(app)
      .post('/upload')
      .attach('file', filePath);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('inserted');
    expect(res.body).toHaveProperty('errors');
    
    // Verify the mock was actually called
    expect(insertMock).toHaveBeenCalled();
  });
});