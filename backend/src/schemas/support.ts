import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(1, 'Subject is required').max(200),
  description: z.string().min(1, 'Description is required').max(1000),
});

export const addMessageSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000),
});