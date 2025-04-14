import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Import bcrypt here

// Mock bcrypt BEFORE importing authRoutes
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof import('bcrypt')>;

// Mock the controller functions BEFORE importing authRoutes
jest.mock('../controller/authControllers', () => ({
  registerUser: jest.fn((req, res) => {
    if (req.body.username === 'error') {
      return res.status(500).json({ message: 'Registration failed from controller' });
    }
    if (!req.body.username || !req.body.email || !req.body.password) {
      return res.status(400).json({ message: 'Invalid input from controller' });
    }
    res.status(201).json({ message: 'User registered successfully from controller', token: 'mockedTokenFromController' });
  }),
  loginUser: jest.fn((req, res) => {
    if (req.body.identifier === 'error') {
      return res.status(500).json({ message: 'Login failed from controller' });
    }
    if (!req.body.identifier || !req.body.password) {
      return res.status(400).json({ message: 'Invalid input from controller' });
    }
    if (req.body.identifier === 'wrong') {
      return res.status(401).json({ message: 'Invalid credentials from controller' });
    }
    res.status(200).json({ message: 'Logged in successfully from controller', token: 'mockedTokenFromController' });
  }),
}));

import authRoutes from '../routes/authRoutes'; // Import authRoutes AFTER mocking dependencies
import { registerUser, loginUser } from '../controller/authControllers';

// Mock the User model (though the controller is now mocked)
jest.mock('../models/user');
const mockedUser = require('../models/user') as jest.Mocked<typeof import('../models/user')>;

// Mock jwt
jest.mock('jsonwebtoken');
const mockedJwt = require('jsonwebtoken') as jest.Mocked<typeof import('jsonwebtoken')>;

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('/auth/register', () => {
    it('should call registerUser controller and return its response', async () => {
      const userData = { username: 'testuser', email: 'test@example.com', password: 'password' };
      const response = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: 'User registered successfully from controller', token: 'mockedTokenFromController' });
      expect(registerUser).toHaveBeenCalledTimes(1);
      expect(registerUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function)); // req, res, next
    });

    it('should return 400 if controller returns 400', async () => {
      const invalidUserData = { username: '', email: 'invalid-email', password: 'short' };
      const response = await request(app)
        .post('/auth/register')
        .send(invalidUserData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid input from controller' });
      expect(registerUser).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if controller returns 500', async () => {
      const errorUserData = { username: 'error', email: 'test@example.com', password: 'password' };
      const response = await request(app)
        .post('/auth/register')
        .send(errorUserData);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: 'Registration failed from controller' });
      expect(registerUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('/auth/login', () => {
    it('should call loginUser controller and return its response on success', async () => {
      const loginData = { identifier: 'testuser', password: 'password' };
      const response = await request(app)
        .post('/auth/login')
        .send(loginData);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ message: 'Logged in successfully from controller', token: 'mockedTokenFromController' });
      expect(loginUser).toHaveBeenCalledTimes(1);
      expect(loginUser).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), expect.any(Function)); // req, res, next
    });

    it('should return 400 if controller returns 400', async () => {
      const invalidLoginData = { identifier: '', password: '' };
      const response = await request(app)
        .post('/auth/login')
        .send(invalidLoginData);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid input from controller' });
      expect(loginUser).toHaveBeenCalledTimes(1);
    });

    it('should return 401 if controller returns 401', async () => {
      const wrongCredentials = { identifier: 'wrong', password: 'password' };
      const response = await request(app)
        .post('/auth/login')
        .send(wrongCredentials);

      expect(response.statusCode).toBe(401);
      expect(response.body).toEqual({ message: 'Invalid credentials from controller' });
      expect(loginUser).toHaveBeenCalledTimes(1);
    });

    it('should return 500 if controller returns 500', async () => {
      const errorLoginData = { identifier: 'error', password: 'password' };
      const response = await request(app)
        .post('/auth/login')
        .send(errorLoginData);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual({ message: 'Login failed from controller' });
      expect(loginUser).toHaveBeenCalledTimes(1);
    });
  });
});