import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: { message: 'Access token required' },
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' },
    });
  }
}

export function requireRole(role: 'BUYER' | 'SELLER' | 'ADMIN') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
      });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({
        success: false,
        error: { message: `Access denied. ${role} role required` },
      });
      return;
    }

    next();
  };
}

export function requireAnyRole(roles: ('BUYER' | 'SELLER' | 'ADMIN')[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: { message: 'Access denied. Insufficient permissions' },
      });
      return;
    }

    next();
  };
}