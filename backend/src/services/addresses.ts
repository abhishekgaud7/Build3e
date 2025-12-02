import prisma from '../db';
import { AppError } from '../middleware/error';

export class AddressService {
  async getAddresses(userId: string) {
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return addresses;
  }

  async getAddressById(id: string, userId: string) {
    const address = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new AppError(404, 'Address not found', 'ADDRESS_NOT_FOUND');
    }

    return address;
  }

  async createAddress(data: {
    label: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
    userId: string;
  }) {
    const { userId, ...addressData } = data;

    return await prisma.$transaction(async (tx) => {
      if (addressData.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const address = await tx.address.create({
        data: {
          ...addressData,
          userId,
        },
      });

      return address;
    });
  }

  async updateAddress(
    id: string,
    data: {
      label?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      pincode?: string;
      isDefault?: boolean;
    },
    userId: string
  ) {
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!existingAddress) {
      throw new AppError(404, 'Address not found', 'ADDRESS_NOT_FOUND');
    }

    return await prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const address = await tx.address.update({
        where: { id },
        data,
      });

      return address;
    });
  }

  async deleteAddress(id: string, userId: string) {
    const address = await prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new AppError(404, 'Address not found', 'ADDRESS_NOT_FOUND');
    }

    if (address.isDefault) {
      throw new AppError(400, 'Cannot delete default address', 'INVALID_OPERATION');
    }

    await prisma.address.delete({
      where: { id },
    });

    return { message: 'Address deleted successfully' };
  }
}