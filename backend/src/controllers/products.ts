import { Request, Response } from 'express';
import { z } from 'zod';
import { ProductService } from '../services/products';
import { ApiResponse } from '../types';
import { createProductSchema, updateProductSchema, productQuerySchema } from '../schemas/products';
import { validate, validateParams, validateQuery } from '../middleware/validation';
import { authenticateToken, requireAnyRole } from '../middleware/auth';

const productService = new ProductService();

export class ProductController {
  getProducts = [
    validateQuery(productQuerySchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const result = await productService.getProducts(req.query);
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

  getProductById = [
    validateParams(z.object({ id: z.string().uuid() })),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const product = await productService.getProductById(req.params['id'] as string);
        const response: ApiResponse = {
          success: true,
          data: { product },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  createProduct = [
    authenticateToken,
    requireAnyRole(['SELLER', 'ADMIN']),
    validate(createProductSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const sellerId = req.user!.userId;
        const product = await productService.createProduct({
          ...req.body,
          sellerId,
        });
        const response: ApiResponse = {
          success: true,
          data: { product },
        };
        res.status(201).json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  updateProduct = [
    authenticateToken,
    requireAnyRole(['SELLER', 'ADMIN']),
    validateParams(z.object({ id: z.string().uuid() })),
    validate(updateProductSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const sellerId = req.user!.userId;
        const isAdmin = req.user!.role === 'ADMIN';
        const product = await productService.updateProduct(
          req.params['id'] as string,
          req.body,
          sellerId,
          isAdmin
        );
        const response: ApiResponse = {
          success: true,
          data: { product },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  deleteProduct = [
    authenticateToken,
    requireAnyRole(['SELLER', 'ADMIN']),
    validateParams(z.object({ id: z.string().uuid() })),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const sellerId = req.user!.userId;
        const isAdmin = req.user!.role === 'ADMIN';
        const product = await productService.deleteProduct(req.params['id'] as string, sellerId, isAdmin);
        const response: ApiResponse = {
          success: true,
          data: { product },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];

  getCategories = [
    validateQuery(z.object({
      page: z.coerce.number().int().min(1).optional().default(1),
      limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    })),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const result = await productService.getCategories(req.query);
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

  getCategoryBySlug = [
    validateParams(z.object({ slug: z.string() })),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const category = await productService.getCategoryBySlug(req.params['slug'] as string);
        const response: ApiResponse = {
          success: true,
          data: { category },
        };
        res.json(response);
      } catch (error) {
        throw error;
      }
    },
  ];
}
