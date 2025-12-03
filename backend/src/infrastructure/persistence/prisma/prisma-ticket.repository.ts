import { PrismaClient, Ticket, TicketStatus } from '@prisma/client';
import { 
  ITicketRepository, 
  CreateTicketData 
} from '../../../application/interfaces/ticket-repository.interface';

export class PrismaTicketRepository implements ITicketRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateTicketData): Promise<any> {
    // Calcula próximo número sequencial na fila
    const lastTicket = await this.prisma.ticket.findFirst({
      where: { queueId: data.queueId, status: 'WAITING' },
      orderBy: { number: 'desc' }
    });

    const nextNumber = lastTicket ? lastTicket.number + 1 : 1;

    const ticket = await this.prisma.ticket.create({
      data: {
        tenantId: data.tenantId,
        queueId: data.queueId,
        customerName: data.customerName,
        number: nextNumber,
        status: 'WAITING'
      }
    });

    return {
      id: ticket.id,
      tenantId: ticket.tenantId,
      queueId: ticket.queueId,
      number: ticket.number,
      customerName: ticket.customerName,
      status: ticket.status,
      createdAt: ticket.createdAt
    };
  }

  async findNextWaiting(tenantId: string, queueId: string): Promise<any | null> {
    const ticket = await this.prisma.ticket.findFirst({
      where: { tenantId, queueId, status: 'WAITING' },
      orderBy: { number: 'asc' }
    });

    if (!ticket) return null;

    return {
      id: ticket.id,
      tenantId: ticket.tenantId,
      queueId: ticket.queueId,
      number: ticket.number,
      customerName: ticket.customerName,
      status: ticket.status,
      createdAt: ticket.createdAt
    };
  }

  async callNextTicket(ticketId: string): Promise<any> {
    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'CALLING', calledAt: new Date() }
    });

    return {
      id: updated.id,
      tenantId: updated.tenantId,
      queueId: updated.queueId,
      number: updated.number,
      customerName: updated.customerName,
      status: updated.status,
      createdAt: updated.createdAt,
      calledAt: updated.calledAt
    };
  }

  async finishTicket(ticketId: string): Promise<any> {
    const updated = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { status: 'FINISHED', finishedAt: new Date() }
    });

    return {
      id: updated.id,
      tenantId: updated.tenantId,
      queueId: updated.queueId,
      number: updated.number,
      customerName: updated.customerName,
      status: updated.status,
      createdAt: updated.createdAt,
      calledAt: updated.calledAt,
      finishedAt: updated.finishedAt
    };
  }
}
