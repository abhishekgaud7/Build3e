import { OrderService } from '../../src/services/orders';
import prisma from '../../src/db';
import { AppError } from '../../src/middleware/error';

jest.mock('../../src/db', () => ({
  product: {
    findMany: jest.fn(),
  },
  address: {
    findFirst: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback({
    product: {
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
  })),
}));

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should calculate order totals correctly', async () => {
      const mockAddress = { id: 'address-id', userId: 'user-id' };
      const mockProducts = [
        { id: 'product-1', name: 'Product 1', price: { toNumber: () => 100 }, stockQuantity: 10 },
        { id: 'product-2', name: 'Product 2', price: { toNumber: () => 200 }, stockQuantity: 5 },
      ];

      (prisma.address.findFirst as jest.Mock).mockResolvedValue(mockAddress);
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const orderData = {
        items: [
          { productId: 'product-1', quantity: 2 },
          { productId: 'product-2', quantity: 1 },
        ],
        addressId: 'address-id',
        userId: 'user-id',
      };

      const mockTransaction = {
        product: { update: jest.fn() },
        order: {
          create: jest.fn().mockResolvedValue({
            id: 'order-id',
            subtotal: 400,
            tax: 72,
            deliveryFee: 50,
            total: 522,
          }),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(mockTransaction);
      });

      const result = await orderService.createOrder(orderData);

      expect(result.subtotal).toBe(400);
      expect(result.tax).toBe(72);
      expect(result.deliveryFee).toBe(50);
      expect(result.total).toBe(522);
    });

    it('should throw error if address not found', async () => {
      (prisma.address.findFirst as jest.Mock).mockResolvedValue(null);

      const orderData = {
        items: [{ productId: 'product-1', quantity: 1 }],
        addressId: 'invalid-address',
        userId: 'user-id',
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Address not found');
    });

    it('should throw error if products not available', async () => {
      const mockAddress = { id: 'address-id', userId: 'user-id' };
      (prisma.address.findFirst as jest.Mock).mockResolvedValue(mockAddress);
      (prisma.product.findMany as jest.Mock).mockResolvedValue([]);

      const orderData = {
        items: [{ productId: 'product-1', quantity: 1 }],
        addressId: 'address-id',
        userId: 'user-id',
      };

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Some products are not available');
    });

    it('should throw error if insufficient stock', async () => {
      const mockAddress = { id: 'address-id', userId: 'user-id' };
      const mockProducts = [
        { id: 'product-1', name: 'Product 1', price: { toNumber: () => 100 }, stockQuantity: 1 },
      ];

      (prisma.address.findFirst as jest.Mock).mockResolvedValue(mockAddress);
      (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

      const orderData = {
        items: [{ productId: 'product-1', quantity: 5 }],
        addressId: 'address-id',
        userId: 'user-id',
      };

      const mockTransaction = {
        product: { update: jest.fn() },
        order: { create: jest.fn() },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (callback) => {
        return callback(mockTransaction);
      });

      await expect(orderService.createOrder(orderData)).rejects.toThrow('Insufficient stock for Product 1');
    });
  });
});