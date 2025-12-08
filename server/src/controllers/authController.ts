import { Request, Response } from 'express';
import { AuthService, RegisterData, LoginData } from '../services/authService';
import { validationResult } from 'express-validator';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.body.errors = errors.array();
        return;
      }

      const data: RegisterData = req.body;
      const result = await AuthService.register(data);

      res.status(201).json({
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        req.body.errors = errors.array();
        return;
      }

      const data: LoginData = req.body;
      const result = await AuthService.login(data);

      res.json({
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;

      res.json({
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}