import { Request, Response } from 'express';
import { OrderService } from '../services/orders';
import { ApiResponse } from '../types';
import { createOrderSchema, updateOrderStatusSchema } from '../schemas/orders';
import { validate, validateParams } from '../middleware/validation';
import { authenticateToken, requireAnyRole } from '../middleware/auth';
import { z } from 'zod';

const orderService = new OrderService();

export class OrderController {
  getOrders = [
    authenticateToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const isAdmin = req.user!.role === 'ADMIN';
        const orders = await orderService.getOrders(userId, isAdmin);
        const response: ApiResponse = {
          success: true,
          data: { orders },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  getOrderById = [
    authenticateToken,
    validateParams(z.object({ id: z.string().uuid() })),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const isAdmin = req.user!.role === 'ADMIN';
        const order = await orderService.getOrderById(req.params.id as string, userId, isAdmin);
        const response: ApiResponse = {
          success: true,
          data: { order },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  createOrder = [
    authenticateToken,
    validate(createOrderSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const order = await orderService.createOrder({
          ...req.body,
          userId,
        });
        const response: ApiResponse = {
          success: true,
          data: { order },
        };
        res.status(201).json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  updateOrderStatus = [
    authenticateToken,
    requireAnyRole(['SELLER', 'ADMIN']),
    validateParams(z.object({ id: z.string().uuid() })),
    validate(updateOrderStatusSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const role = req.user!.role;
        const order = await orderService.updateOrderStatus(
          req.params.id as string,
          req.body.status,
          userId,
          role
        );
        const response: ApiResponse = {
          success: true,
          data: { order },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];
}
