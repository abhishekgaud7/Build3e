import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import addressRoutes from './routes/addresses';
import orderRoutes from './routes/orders';
import supportRoutes from './routes/support';

export function createApp(): express.Application {
  const app = express();

  app.use(helmet());
  const allowedExact = new Set([
    config.frontendUrl,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:5173',
  ]);
  const vercelWildcard = /^https:\/\/.*\.vercel\.app$/;
  app.use(cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedExact.has(origin) || vercelWildcard.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS: Origin not allowed'));
    },
    credentials: true,
  }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/addresses', addressRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/support', supportRoutes);

  app.use(errorHandler);

  app.use('*', (_req, res) => {
    res.status(404).json({
      success: false,
      error: { message: 'Route not found' },
    });
  });

  return app;
}
