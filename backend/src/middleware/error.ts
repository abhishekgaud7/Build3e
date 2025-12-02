import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', error);

  if (error instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
    };
    res.status(error.statusCode).json(response);
    return;
  }

  if (error.name === 'ValidationError') {
    const response: ApiResponse = {
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.message,
      },
    };
    res.status(400).json(response);
    return;
  }

  const response: ApiResponse = {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
  };
  res.status(500).json(response);
}