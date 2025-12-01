import { CallNextTicketUseCase } from '../../application/use-cases/tickets/call-next-ticket.use-case';
import { InMemoryTicketRepository } from '../../infrastructure/persistence/in-memory/in-memory-ticket.repository';
import { FakeMessageQueueAdapter } from '../../infrastructure/messaging/fake/fake-message-queue.adapter';

export function makeCallNextTicketUseCase() {
  const ticketRepository = new InMemoryTicketRepository();
  const messageQueue = new FakeMessageQueueAdapter();

  return new CallNextTicketUseCase(ticketRepository, messageQueue);
}
