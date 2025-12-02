import { Request, Response } from 'express';
import { AuthService } from '../services/auth';
import { ApiResponse } from '../types';
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/auth';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const authService = new AuthService();

export class AuthController {
  register = [
    validate(registerSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const result = await authService.register(req.body);
        const response: ApiResponse = {
          success: true,
          data: result,
        };
        res.status(201).json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  login = [
    validate(loginSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        const response: ApiResponse = {
          success: true,
          data: result,
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  logout = async (_req: Request, res: Response): Promise<void> => {
    const response: ApiResponse = {
      success: true,
      data: { message: 'Logged out successfully' },
    };
    res.json(response);
  };

  me = [
    authenticateToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const user = await authService.getUserById(userId);
        const response: ApiResponse = {
          success: true,
          data: { user },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  updateProfile = [
    authenticateToken,
    validate(updateProfileSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const user = await authService.updateProfile(userId, req.body);
        const response: ApiResponse = {
          success: true,
          data: { user },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];
}