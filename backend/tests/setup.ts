import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  const tables = ['order_items', 'orders', 'addresses', 'products', 'categories', 'support_messages', 'support_tickets', 'users'];
  
  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
    } catch (error) {
      console.warn(`Could not truncate ${table}:`, error);
    }
  }
});