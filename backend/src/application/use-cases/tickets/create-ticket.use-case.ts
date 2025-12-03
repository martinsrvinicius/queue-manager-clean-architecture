import { ITicketRepository, CreateTicketData } from '../../interfaces/ticket-repository.interface';
import { IMessageQueue } from '../../interfaces/message-queue.interface';
import { IWebSocketGateway } from '../../interfaces/websocket-gateway.interface';

interface CreateTicketInput {
  tenantId: string;
  queueId: string;
  customerName: string;
}

interface CreateTicketOutput {
  id: string;
  tenantId: string;
  queueId: string;
  number: number;
  customerName: string;
  status: 'WAITING';
  createdAt: Date;
}

export class CreateTicketUseCase {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly messageQueue: IMessageQueue,
    private readonly wsGateway: IWebSocketGateway,
  ) {}

  async execute(input: CreateTicketInput): Promise<CreateTicketOutput> {
    const ticketData: CreateTicketData = {
      tenantId: input.tenantId,
      queueId: input.queueId,
      customerName: input.customerName,
      status: 'WAITING',
    };

    const ticket = await this.ticketRepository.create(ticketData);

    // NOVO: Emite via WebSocket para queue específica
    this.wsGateway.emitToQueue('ticket.created', {
      ticketId: ticket.id,
      number: ticket.number,
      customerName: ticket.customerName,
    }, input.tenantId, input.queueId);

    await this.messageQueue.publish(
      `tenant.${input.tenantId}.ticket.created`,
      {
        tenantId: input.tenantId,
        queueId: input.queueId,
        ticketId: ticket.id,
        customerName: ticket.customerName,
        number: ticket.number,
      }
    );

    return {
      id: ticket.id,
      tenantId: ticket.tenantId,
      queueId: ticket.queueId,
      number: ticket.number,
      customerName: ticket.customerName,
      status: 'WAITING',
      createdAt: ticket.createdAt,
    };
  }
}
