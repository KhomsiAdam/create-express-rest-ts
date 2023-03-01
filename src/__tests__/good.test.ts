import request from 'supertest';
import server from '@config/server';

describe('Good. 👌', () => {
  it('Good. 👌', async () => {
    const response = await request(server).get('/api');
    expect(response.statusCode).toBe(200);
  });
});
