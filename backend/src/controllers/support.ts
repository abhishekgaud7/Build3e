import { Request, Response } from 'express';
import { SupportService } from '../services/support';
import { ApiResponse } from '../types';
import { createTicketSchema, addMessageSchema } from '../schemas/support';
import { validate, validateParams } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const supportService = new SupportService();

export class SupportController {
  getTickets = [
    authenticateToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const isAdmin = req.user!.role === 'ADMIN';
        const tickets = await supportService.getTickets(userId, isAdmin);
        const response: ApiResponse = {
          success: true,
          data: { tickets },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  getTicketById = [
    authenticateToken,
    validateParams(z.object({ id: z.string().uuid() })),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const isAdmin = req.user!.role === 'ADMIN';
        const ticket = await supportService.getTicketById(req.params.id as string, userId, isAdmin);
        const response: ApiResponse = {
          success: true,
          data: { ticket },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  createTicket = [
    authenticateToken,
    validate(createTicketSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const ticket = await supportService.createTicket({
          ...req.body,
          userId,
        });
        const response: ApiResponse = {
          success: true,
          data: { ticket },
        };
        res.status(201).json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  addMessage = [
    authenticateToken,
    validateParams(z.object({ id: z.string().uuid() })),
    validate(addMessageSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const isAdmin = req.user!.role === 'ADMIN';
        const ticket = await supportService.addMessage({
          ticketId: req.params.id as string,
          message: req.body.message,
          userId,
          isAdmin,
        });
        const response: ApiResponse = {
          success: true,
          data: { ticket },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];
}