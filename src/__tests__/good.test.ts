import request from 'supertest';
import app from './test.server';

describe('Good. 👌', () => {
  it('Good. 👌', async () => {
    const response = await request(app).get('/api');
    expect(response.statusCode).toBe(200);
  });
});
