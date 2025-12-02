import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayload } from '../types';

export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}