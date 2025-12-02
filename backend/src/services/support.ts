import prisma from '../db';
import { AppError } from '../middleware/error';

export class SupportService {
  async getTickets(userId: string, isAdmin: boolean = false) {
    const where = isAdmin ? {} : { userId };

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return tickets;
  }

  async getTicketById(id: string, userId: string, isAdmin: boolean = false) {
    const ticket = await prisma.supportTicket.findFirst({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      throw new AppError(404, 'Ticket not found', 'TICKET_NOT_FOUND');
    }

    if (!isAdmin && ticket.userId !== userId) {
      throw new AppError(403, 'You can only view your own tickets', 'FORBIDDEN');
    }

    return ticket;
  }

  async createTicket(data: {
    subject: string;
    description: string;
    userId: string;
  }) {
    const ticket = await prisma.supportTicket.create({
      data: {
        subject: data.subject,
        description: data.description,
        userId: data.userId,
        messages: {
          create: {
            senderType: 'USER',
            message: data.description,
          },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return ticket;
  }

  async addMessage(data: {
    ticketId: string;
    message: string;
    userId: string;
    isAdmin: boolean;
  }) {
    const ticket = await prisma.supportTicket.findFirst({
      where: { id: data.ticketId },
    });

    if (!ticket) {
      throw new AppError(404, 'Ticket not found', 'TICKET_NOT_FOUND');
    }

    if (!data.isAdmin && ticket.userId !== data.userId) {
      throw new AppError(403, 'You can only add messages to your own tickets', 'FORBIDDEN');
    }

    const senderType = data.isAdmin ? 'ADMIN' : 'USER';

    const message = await prisma.supportMessage.create({
      data: {
        ticketId: data.ticketId,
        message: data.message,
        senderType,
      },
      include: {
        ticket: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            messages: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    });

    return message.ticket;
  }
}