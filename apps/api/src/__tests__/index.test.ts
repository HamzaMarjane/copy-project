import request from 'supertest';
import { app, server } from '../index';
  
describe('API Server', () => {
  afterAll((done: jest.DoneCallback) => {
    server.close(done);
  });

  it('should start without errors', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Welcome to my API!" });
  });

  it('should have a /trpc endpoint', async () => {
    const response = await request(app).get('/trpc');
    expect(response.status).toBe(404); // TRPC will return 404 if no procedure is specified
  });
});