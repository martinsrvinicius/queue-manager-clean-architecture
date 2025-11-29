import { ITicketRepository, CreateTicketData, TicketModel } from '../../../application/interfaces/ticket-repository.interface';

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

  // NOVO: encontra próximo ticket WAITING
  async findNextWaiting(tenantId: string, queueId: string): Promise<TicketModel | null> {
    const nextWaiting = tickets.find(
      t => t.tenantId === tenantId && 
           t.queueId === queueId && 
           t.status === 'WAITING'
    );

    if (nextWaiting) {
      console.log('[IN-MEMORY] Found next waiting ticket:', nextWaiting);
    } else {
      console.log('[IN-MEMORY] No waiting tickets for tenant/queue:', { tenantId, queueId });
    }

    return nextWaiting || null;
  }
}
