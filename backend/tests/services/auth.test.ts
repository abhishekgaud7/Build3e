import { AuthService } from '../../src/services/auth';
import prisma from '../../src/db';
import { hashPassword } from '../../src/utils/password';

jest.mock('../../src/db', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('../../src/utils/password', () => ({
  hashPassword: jest.fn(),
  verifyPassword: jest.fn(),
}));

jest.mock('../../src/utils/jwt', () => ({
  generateToken: jest.fn(() => 'mock-jwt-token'),
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'BUYER' as const,
        password: 'password123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue('hashed-password');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-id',
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await authService.register(userData);

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'BUYER' as const,
        password: 'password123',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'existing-user',
        email: userData.email,
      });

      await expect(authService.register(userData)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const hashedPassword = 'hashed-password';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'user-id',
        name: 'Test User',
        email,
        passwordHash: hashedPassword,
        role: 'BUYER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const { verifyPassword } = require('../../src/utils/password');
      (verifyPassword as jest.Mock).mockResolvedValue(true);

      const result = await authService.login(email, password);

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should throw error for invalid credentials', async () => {
      const email = 'test@example.com';
      const password = 'wrong-password';

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(email, password)).rejects.toThrow('Invalid email or password');
    });
  });
});