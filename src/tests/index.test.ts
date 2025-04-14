import request from 'supertest';
import { app, server } from '../index';
import mongoose from 'mongoose';
import { connectDB } from '../index'; // Import connectDB

describe('API Tests', () => {
    beforeAll(async () => {
        await connectDB();
        await new Promise(resolve => setTimeout(resolve, 500));
      });
    
      afterAll(async () => {
        await mongoose.disconnect();
        await new Promise(resolve => server.close(resolve)); // Close the server
      });

  describe('GET /', () => {
    it('should return a 200 status and the welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.statusCode).toBe(200);
      expect(response.text).toContain('Welcome to the Express Backend API');
    });
  });

  describe('Auth Routes', () => {
    it('should respond to /api/auth/register', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });
      expect(response.statusCode).not.toBe(404);
      // Add more specific assertions based on your registration logic
    });

    it('should respond to /api/auth/login', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(response.statusCode).not.toBe(404);
      // Add more specific assertions based on your login logic
    });
  });

  describe('Product Routes', () => {
    it('should respond to /api/products', async () => {
      const response = await request(app).get('/api/products');
      expect(response.statusCode).not.toBe(404);
      // Add more specific assertions based on your product retrieval logic
    });

    // Add more tests for creating, updating, deleting products, etc.
  });
});