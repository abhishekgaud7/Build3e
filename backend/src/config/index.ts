import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function composeDatabaseUrlFromSupabase(): string {
  const ref = process.env['SUPABASE_PROJECT_REF'] as string | undefined;
  const pwd = process.env['SUPABASE_DB_PASSWORD'] as string | undefined;
  if (ref && pwd) {
    return `postgresql://postgres:${encodeURIComponent(pwd)}@db.${ref}.supabase.co:5432/postgres?sslmode=require`;
  }
  return '';
}

export const config = {
  port: Number(process.env['PORT'] || 3000),
  nodeEnv: (process.env['NODE_ENV'] as string) || 'development',
  databaseUrl: ((process.env['DATABASE_URL'] as string) || composeDatabaseUrlFromSupabase()),
  jwtSecret: (process.env['JWT_SECRET'] as string) || 'dev-secret-key',
  frontendUrl: (process.env['FRONTEND_URL'] as string) || 'http://localhost:5173',
  supabaseUrl: (process.env['SUPABASE_URL'] as string) || '',
} as const;

export function validateConfig(): void {
  const hasDbUrl = Boolean(process.env['DATABASE_URL']) || (Boolean(process.env['SUPABASE_PROJECT_REF']) && Boolean(process.env['SUPABASE_DB_PASSWORD']));
  const missing: string[] = [];
  if (!hasDbUrl) {
    missing.push('SUPABASE_PROJECT_REF', 'SUPABASE_DB_PASSWORD');
  }
  if (!process.env['JWT_SECRET']) {
    missing.push('JWT_SECRET');
  }
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
