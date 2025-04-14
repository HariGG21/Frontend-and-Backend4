import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/authMiddleware';

// Mock the jwt module
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

// Mock the Request, Response, and NextFunction types
type MockRequest = Partial<Request> & { header?: jest.Mock };
type MockResponse = Partial<Response> & { status?: jest.Mock; json?: jest.Mock };
type MockNextFunction = jest.Mock;

describe('authMiddleware', () => {
  let mockReq: MockRequest;
  let mockRes: MockResponse;
  let mockNext: MockNextFunction;

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mock calls before each test
    mockReq = {
      header: jest.fn(),
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    // Set a default JWT_SECRET for testing
    process.env.JWT_SECRET = 'test-secret';
  });

  it('should call next if token is valid', () => {
    const token = 'valid.token.here';
    mockReq.header!.mockReturnValue(`Bearer ${token}`);
    const decodedPayload = { userId: 'someUserId' };
    mockedJwt.verify.mockReturnValue(decodedPayload);

    authMiddleware(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockReq.user).toEqual(decodedPayload);
    expect(mockedJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should return 401 and error if no token is provided', () => {
    mockReq.header!.mockReturnValue(undefined);

    authMiddleware(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockReq.user).toBeUndefined();
    expect(mockedJwt.verify).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 and error if token is not valid', () => {
    const token = 'invalid.token.here';
    mockReq.header!.mockReturnValue(`Bearer ${token}`);
    mockedJwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authMiddleware(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockReq.user).toBeUndefined();
    expect(mockedJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle token without Bearer prefix', () => {
    const token = 'valid.token.here';
    mockReq.header!.mockReturnValue(token);
    const decodedPayload = { userId: 'anotherUserId' };
    mockedJwt.verify.mockReturnValue(decodedPayload);

    authMiddleware(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockReq.user).toEqual(decodedPayload);
    expect(mockedJwt.verify).toHaveBeenCalledWith(token, 'test-secret');
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should return 401 and error if Authorization header has only "Bearer "', () => {
    mockReq.header!.mockReturnValue('Bearer ');

    authMiddleware(mockReq as Request, mockRes as Response, mockNext as NextFunction);

    expect(mockReq.user).toBeUndefined();
    expect(mockedJwt.verify).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});




