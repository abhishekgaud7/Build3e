import prisma from '../db';
import { AppError } from '../middleware/error';
import { getPaginationParams, createPaginationResponse } from '../utils/pagination';

export class ProductService {
  async getProducts(params: {
    search?: string;
    categorySlug?: string;
    page?: number;
    limit?: number;
  }) {
    const { skip, take } = getPaginationParams({ page: params.page || 1, limit: params.limit || 10 });

    const where: any = { isActive: true };

    if (params.search) {
      where.name = { contains: params.search, mode: 'insensitive' };
    }

    if (params.categorySlug) {
      where.category = { slug: params.categorySlug };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          seller: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return createPaginationResponse(products, total, params.page || 1, take);
  }

  async getProductById(id: string) {
    const product = await prisma.product.findFirst({
      where: { id, isActive: true },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    if (!product) {
      throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
    }

    return product;
  }

  async createProduct(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    unit: string;
    stockQuantity: number;
    categoryId?: string;
    sellerId: string;
  }) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (existingProduct) {
      throw new AppError(400, 'Product with this slug already exists', 'SLUG_EXISTS');
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new AppError(404, 'Category not found', 'CATEGORY_NOT_FOUND');
      }
    }

    const product = await prisma.product.create({
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    return product;
  }

  async updateProduct(id: string, data: any, sellerId: string, isAdmin: boolean = false) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
    }

    if (!isAdmin && product.sellerId !== sellerId) {
      throw new AppError(403, 'You can only update your own products', 'FORBIDDEN');
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new AppError(404, 'Category not found', 'CATEGORY_NOT_FOUND');
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    return updatedProduct;
  }

  async deleteProduct(id: string, sellerId: string, isAdmin: boolean = false) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
    }

    if (!isAdmin && product.sellerId !== sellerId) {
      throw new AppError(403, 'You can only delete your own products', 'FORBIDDEN');
    }

    const deletedProduct = await prisma.product.update({
      where: { id },
      data: { isActive: false },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, name: true } },
      },
    });

    return deletedProduct;
  }

  async getCategories(params: { page?: number; limit?: number }) {
    const { skip, take } = getPaginationParams({ page: params.page, limit: params.limit });

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      prisma.category.count(),
    ]);

    return createPaginationResponse(categories, total, params.page || 1, take);
  }

  async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new AppError(404, 'Category not found', 'CATEGORY_NOT_FOUND');
    }

    return category;
  }
}