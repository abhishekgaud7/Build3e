import { createApp } from './app';
import { config, validateConfig } from './config';
import prisma from './db';

async function main(): Promise<void> {
  try {
    validateConfig();

    const app = createApp();

    const server = app.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
    });

    process.on('SIGTERM', async () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
      });
      await prisma.$disconnect();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('🛑 SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
      });
      await prisma.$disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Uncaught error:', error);
    process.exit(1);
  });
}