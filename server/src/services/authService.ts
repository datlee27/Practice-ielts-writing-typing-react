import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  token: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId: number): string {
    const secret = process.env.JWT_SECRET || 'default_secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign({ userId }, secret, { expiresIn } as any);
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = data;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
      token,
    };
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await this.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
      token,
    };
  }

  static async getUserById(id: number): Promise<User | null> {
    return User.findByPk(id);
  }
}