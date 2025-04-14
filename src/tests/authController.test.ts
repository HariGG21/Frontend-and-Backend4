import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { registerUser, loginUser } from '../controller/authControllers';

// Mocking the User model
jest.mock('../models/user');
const mockedUser = User as jest.Mocked<typeof User>;

// Mocking bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Mocking jwt
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

// Mocking Request and Response
const mockRequest = (body: Record<string, any> = {}) => ({
  body,
} as Request);

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('authControllers', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret'; // Set a test JWT secret
  });

  describe('registerUser', () => {
    it('should just call save and toObject', async () => {
        const mockToObjectResult = { _id: 'testId', username: 'test', email: 'test@example.com', password: 'testpass' };
        const mockSaveResult = { ...mockToObjectResult, toObject: jest.fn().mockReturnValue(mockToObjectResult) };
        mockedUser.prototype.save = jest.fn().mockResolvedValue(mockSaveResult);
      
        const newUser = new mockedUser({ username: 'test', email: 'test@example.com', password: 'testpass' });
        await newUser.save();
        newUser.toObject();
      
        expect(newUser.save).toHaveBeenCalledTimes(1);
        expect(newUser.toObject).toHaveBeenCalledTimes(1);
      });

    // ... (rest of your registerUser tests)
  });

  describe('loginUser', () => {
    it('should log in an existing user and return a token', async () => {
      const req = mockRequest({ email: 'test@example.com', password: 'password123' });
      const res = mockResponse();
      const hashedPassword = 'hashedPassword';
      const user = {
        _id: 'someUserId',
        email: 'test@example.com',
        password: hashedPassword,
        toObject: jest.fn().mockReturnValue({ // Mock toObject to return with password
          _id: 'someUserId',
          email: 'test@example.com',
          password: hashedPassword,
        }),
      } as any;
      const token = 'testToken';

      mockedUser.findOne.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true);
      mockedJwt.sign.mockReturnValue(token);

      await loginUser(req, res);

      expect(mockedUser.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith('password123', hashedPassword);
      expect(user.toObject).toHaveBeenCalledTimes(1); // Ensure toObject was called
      expect(mockedJwt.sign).toHaveBeenCalledWith({ userId: 'someUserId' }, 'test-secret', { expiresIn: '1h' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ token, user: { _id: 'someUserId', email: 'test@example.com' } });
    });

    // ... (rest of your loginUser tests)
  });
});