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
    // 1. Busca próximo ticket WAITING (implementar no repo depois)
    const nextTicket = await this.ticketRepository.findNextWaiting(input.tenantId, input.queueId);
    
    if (!nextTicket) {
      throw new Error('No waiting tickets in queue');
    }

    // 2. Chama ticket (muda status e seta calledAt)
    //nextTicket.call();

    // 3. Publica evento
    await this.messageQueue.publish(
      `tenant.${input.tenantId}.ticket.called`,
      {
        tenantId: input.tenantId,
        queueId: input.queueId,
        ticketId: nextTicket.id,
        customerName: nextTicket.customerName,
        number: nextTicket.number,
      }
    );

    return {
      id: nextTicket.id,
      tenantId: nextTicket.tenantId,
      queueId: nextTicket.queueId,
      number: nextTicket.number,
      customerName: nextTicket.customerName,
      status: 'CALLING',
      calledAt: nextTicket.calledAt!,
    };
  }
}
