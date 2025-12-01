import { ITicketRepository, CreateTicketData, TicketModel } from '../../../application/interfaces/ticket-repository.interface';
import { Ticket } from '../../../domain/entities/ticket.entity';

let currentId = 1;
let currentNumber = 1;
const tickets: TicketModel[] = [];

export class InMemoryTicketRepository implements ITicketRepository {
  async create(data: CreateTicketData): Promise<TicketModel> {
    const ticket: TicketModel = {
      id: `ticket-${Date.now()}-${currentId++}`,
      tenantId: data.tenantId,
      queueId: data.queueId,
      number: currentNumber++,
      customerName: data.customerName,
      status: data.status,
      createdAt: new Date(),
    };

    tickets.push(ticket);
    console.log('[IN-MEMORY] Created ticket:', ticket);

    return ticket;
  }

  async findNextWaiting(tenantId: string, queueId: string): Promise<TicketModel | null> {
    const nextWaiting = tickets.find(
      t => t.tenantId === tenantId && 
           t.queueId === queueId && 
           t.status === 'WAITING'
    );

    if (nextWaiting) {
      console.log('[IN-MEMORY] Found next waiting ticket:', nextWaiting);
    }

    return nextWaiting || null;
  }

  // NOVO: simula mudança de status (sem persistir ainda)
  async callNextTicket(ticketId: string): Promise<TicketModel> {
    const ticketIndex = tickets.findIndex(t => t.id === ticketId);
    if (ticketIndex === -1) {
      throw new Error(`Ticket ${ticketId} not found`);
    }

    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      status: 'CALLING' as const,
      calledAt: new Date(),
    };

    console.log('[IN-MEMORY] Called ticket:', tickets[ticketIndex]);
    return tickets[ticketIndex];
  }
}
