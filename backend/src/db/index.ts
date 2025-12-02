import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: (process.env['NODE_ENV'] as string) === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;

export * from '@prisma/client';
