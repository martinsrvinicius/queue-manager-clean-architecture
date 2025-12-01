import { ITicketRepository } from '../../interfaces/ticket-repository.interface';
import { IMessageQueue } from '../../interfaces/message-queue.interface';

interface CallNextTicketInput {
  tenantId: string;
  queueId: string;
}

interface CallNextTicketOutput {
  id: string;
  tenantId: string;
  queueId: string;
  number: number;
  customerName: string;
  status: 'CALLING';
  calledAt: Date;
}

export class CallNextTicketUseCase {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly messageQueue: IMessageQueue,
  ) {}

  async execute(input: CallNextTicketInput): Promise<CallNextTicketOutput> {
    const nextTicket = await this.ticketRepository.findNextWaiting(input.tenantId, input.queueId);
    
    if (!nextTicket) {
      throw new Error('No waiting tickets in queue');
    }

    // Chama ticket via repositório
    const calledTicket = await this.ticketRepository.callNextTicket(nextTicket.id);

    // Publica evento
    await this.messageQueue.publish(
      `tenant.${input.tenantId}.ticket.called`,
      {
        tenantId: input.tenantId,
        queueId: input.queueId,
        ticketId: calledTicket.id,
        customerName: calledTicket.customerName,
        number: calledTicket.number,
      }
    );

    return {
      id: calledTicket.id,
      tenantId: calledTicket.tenantId,
      queueId: calledTicket.queueId,
      number: calledTicket.number,
      customerName: calledTicket.customerName,
      status: 'CALLING',
      calledAt: calledTicket.calledAt!,
    };
  }
}

