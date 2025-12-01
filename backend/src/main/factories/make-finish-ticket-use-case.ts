import { FinishTicketUseCase } from '../../application/use-cases/tickets/finish-ticket.use-case';
import { InMemoryTicketRepository } from '../../infrastructure/persistence/in-memory/in-memory-ticket.repository';
import { FakeMessageQueueAdapter } from '../../infrastructure/messaging/fake/fake-message-queue.adapter';

export function makeFinishTicketUseCase() {
  const ticketRepository = new InMemoryTicketRepository();
  const messageQueue = new FakeMessageQueueAdapter();

  return new FinishTicketUseCase(ticketRepository, messageQueue);
}
