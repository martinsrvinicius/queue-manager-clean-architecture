import { ITicketRepository } from '../../interfaces/ticket-repository.interface';
import { IMessageQueue } from '../../interfaces/message-queue.interface';
import { IWebSocketGateway } from '../../interfaces/websocket-gateway.interface';

interface FinishTicketInput {
  tenantId: string;
  ticketId: string;
}

interface FinishTicketOutput {
  id: string;
  tenantId: string;
  queueId: string;
  number: number;
  customerName: string;
  status: 'FINISHED';
  finishedAt: Date;
}

export class FinishTicketUseCase {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly messageQueue: IMessageQueue,
    private readonly wsGateway: IWebSocketGateway, // NOVO
  ) {}

  async execute(input: FinishTicketInput): Promise<FinishTicketOutput> {
    const finished = await this.ticketRepository.finishTicket(input.ticketId);

    // NOVO: Emite via WebSocket
    this.wsGateway.emitToQueue('ticket.finished', {
      ticketId: finished.id,
      number: finished.number,
      customerName: finished.customerName,
    }, input.tenantId, finished.queueId);

    await this.messageQueue.publish(
      `tenant.${input.tenantId}.ticket.finished`,
      {
        tenantId: finished.tenantId,
        queueId: finished.queueId,
        ticketId: finished.id,
        number: finished.number,
      }
    );

    return {
      id: finished.id,
      tenantId: finished.tenantId,
      queueId: finished.queueId,
      number: finished.number,
      customerName: finished.customerName,
      status: 'FINISHED',
      finishedAt: finished.finishedAt!,
    };
  }
}
