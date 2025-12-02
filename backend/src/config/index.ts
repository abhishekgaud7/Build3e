import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: Number(process.env['PORT'] || 3000),
  nodeEnv: (process.env['NODE_ENV'] as string) || 'development',
  databaseUrl: (process.env['DATABASE_URL'] as string) || '',
  jwtSecret: (process.env['JWT_SECRET'] as string) || 'dev-secret-key',
  frontendUrl: (process.env['FRONTEND_URL'] as string) || 'http://localhost:5173',
} as const;

export function validateConfig(): void {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
