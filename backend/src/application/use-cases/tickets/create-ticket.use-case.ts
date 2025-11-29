import { ITicketRepository, CreateTicketData } from '../../interfaces/ticket-repository.interface';
import { IMessageQueue } from '../../interfaces/message-queue.interface';

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
  ) {}

  async execute(input: CreateTicketInput): Promise<CreateTicketOutput> {
    // 1. Cria ticket no banco
    const ticketData: CreateTicketData = {
      tenantId: input.tenantId,
      queueId: input.queueId,
      customerName: input.customerName,
      status: 'WAITING',
    };

    const ticket = await this.ticketRepository.create(ticketData);

    // 2. Publica evento para processamento assíncrono
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

    // 3. Retorna resultado
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
