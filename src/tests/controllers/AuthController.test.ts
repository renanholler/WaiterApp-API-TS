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
  describe('login', () => {
    it('should login with valid credentials', async () => {
      const req = {
        body: {
          email: 'batata@teste.com',
          senha: '12345',
        },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const user = {
        _id: '1',
        email: 'batata@teste.com',
        senha: 'hashedPassword',
      };

      (User.findOne as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        token: 'token',
        user: {
          _id: '1',
          email: 'batata@teste.com',
        },
      });
    });

    it('should not login with invalid email', async () => {
      const req = {
        body: {
          email: 'invalid@teste.com',
          senha: '12345',
        },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
    });

    it('should not login with invalid email format', async () => {
      const req = {
        body: {
          email: 'teste',
          senha: '123',
        },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
    });
  });
});
