import { Request, Response } from 'express';
import { AddressService } from '../services/addresses';
import { ApiResponse } from '../types';
import { createAddressSchema, updateAddressSchema } from '../schemas/addresses';
import { validate, validateParams } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const addressService = new AddressService();

export class AddressController {
  getAddresses = [
    authenticateToken,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const addresses = await addressService.getAddresses(userId);
        const response: ApiResponse = {
          success: true,
          data: { addresses },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  getAddressById = [
    authenticateToken,
    validateParams(z.object({ id: z.string().uuid() })),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const address = await addressService.getAddressById(req.params.id as string, userId);
        const response: ApiResponse = {
          success: true,
          data: { address },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  createAddress = [
    authenticateToken,
    validate(createAddressSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const address = await addressService.createAddress({
          ...req.body,
          userId,
        });
        const response: ApiResponse = {
          success: true,
          data: { address },
        };
        res.status(201).json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  updateAddress = [
    authenticateToken,
    validateParams(z.object({ id: z.string().uuid() })),
    validate(updateAddressSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const address = await addressService.updateAddress(req.params.id as string, req.body, userId);
        const response: ApiResponse = {
          success: true,
          data: { address },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  deleteAddress = [
    authenticateToken,
    validateParams(z.object({ id: z.string().uuid() })),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userId = req.user!.userId;
        const result = await addressService.deleteAddress(req.params.id, userId);
        const response: ApiResponse = {
          success: true,
          data: result,
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];
}