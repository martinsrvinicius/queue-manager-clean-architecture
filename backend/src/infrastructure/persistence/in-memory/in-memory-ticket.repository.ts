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
}
