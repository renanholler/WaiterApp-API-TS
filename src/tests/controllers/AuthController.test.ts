import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthController from '../../app/controllers/auth/AuthController';
import User from '../../app/models/User';

// Mocking dependencies
jest.mock('../../app/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  /**
   * RT18
   */
  it('should login with valid credentials', async () => {
    // Arrange
    req.body = {
      email: 'batata@teste.com',
      senha: '12345',
    };

    const user = {
      _id: '1',
      email: 'batata@teste.com',
      senha: 'hashedPassword',
    };

    (User.findOne as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('token');

    // Act
    await AuthController.login(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'token',
      user: {
        _id: user._id,
        email: user.email,
      },
    });
  });

  it('should not login with invalid email', async () => {
    // Arrange
    req.body = {
      email: 'invalid@teste.com',
      senha: '12345',
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);

    // Act
    await AuthController.login(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  /**
   * RT19
   */
  it('should not login with invalid email format', async () => {
    // Arrange
    req.body = {
      email: 'teste',
      senha: '123',
    };

    // Act
    await AuthController.login(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
  });

  /**
   * RT20
   */
  it('should not login with invalid password', async () => {
    // Arrange
    req.body = {
      email: 'batata@teste.com',
      senha: 'wrongpassword',
    };

    const user = {
      _id: '1',
      email: 'batata@teste.com',
      senha: 'hashedPassword',
    };

    (User.findOne as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    // Act
    await AuthController.login(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

  /**
   * RT21
   */
  it('should not login with empty email and password', async () => {
    // Arrange
    req.body = {
      email: '',
      senha: '',
    };

    // Act
    await AuthController.login(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email and password are required' });
  });

  /**
   * RT22
   */
  it('should not login with malformed email', async () => {
    // Arrange
    req.body = {
      email: 'batata@@teste.com.com.',
      senha: '12345',
    };

    // Act
    await AuthController.login(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
  });

  /**
   * RT23
   */
  it('should not login with short password', async () => {
    // Arrange
    req.body = {
      email: 'batata@teste.com',
      senha: '12',
    };

    // Act
    await AuthController.login(req as Request, res as Response);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Password is too short' });
  });
});
