import prisma from '../db';
import { AppError } from '../middleware/error';

export class OrderService {
  async getOrders(userId: string, isAdmin: boolean = false) {
    const where = isAdmin ? {} : { userId };

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        address: true,
        orderItems: {
          include: {
            product: { select: { id: true, name: true, price: true, unit: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }

  async getOrderById(id: string, userId: string, isAdmin: boolean = false) {
    const order = await prisma.order.findFirst({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        address: true,
        orderItems: {
          include: {
            product: { select: { id: true, name: true, price: true, unit: true } },
          },
        },
      },
    });

    if (!order) {
      throw new AppError(404, 'Order not found', 'ORDER_NOT_FOUND');
    }

    if (!isAdmin && order.userId !== userId) {
      throw new AppError(403, 'You can only view your own orders', 'FORBIDDEN');
    }

    return order;
  }

  async createOrder(data: {
    items: Array<{ productId: string; quantity: number }>;
    addressId: string;
    userId: string;
  }) {
    const { items, addressId, userId } = data;

    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new AppError(404, 'Address not found', 'ADDRESS_NOT_FOUND');
    }

    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
    });

    if (products.length !== items.length) {
      throw new AppError(400, 'Some products are not available', 'INVALID_OPERATION');
    }

    const productMap = new Map(products.map(p => [p.id, p]));

    return await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new AppError(400, `Product ${item.productId} not found`, 'PRODUCT_NOT_FOUND');
        }

        if (product.stockQuantity < item.quantity) {
          throw new AppError(400, `Insufficient stock for ${product.name}`, 'INSUFFICIENT_STOCK');
        }

        const unitPrice = product.price.toNumber();
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          lineTotal,
        });

        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
          },
        });
      }

      const tax = subtotal * 0.18;
      const deliveryFee = 50;
      const total = subtotal + tax + deliveryFee;

      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          subtotal,
          tax,
          deliveryFee,
          total,
          orderItems: {
            create: orderItems,
          },
        },
        include: {
          address: true,
          orderItems: {
            include: {
              product: { select: { id: true, name: true, price: true, unit: true } },
            },
          },
        },
      });

      return order;
    });
  }

  async updateOrderStatus(id: string, status: string, userId: string, role: 'BUYER' | 'SELLER' | 'ADMIN') {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: { product: { select: { sellerId: true } } },
        },
      },
    });

    if (!order) {
      throw new AppError(404, 'Order not found', 'ORDER_NOT_FOUND');
    }

    if (role === 'BUYER') {
      throw new AppError(403, 'Insufficient permissions', 'FORBIDDEN');
    }

    if (role === 'SELLER') {
      const ownsAllItems = order.orderItems.every((item) => item.product.sellerId === userId);
      if (!ownsAllItems) {
        throw new AppError(403, 'You can only update orders for your products', 'FORBIDDEN');
      }
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        user: { select: { id: true, name: true, email: true } },
        address: true,
        orderItems: {
          include: {
            product: { select: { id: true, name: true, price: true, unit: true } },
          },
        },
      },
    });

    return updatedOrder;
  }
}
