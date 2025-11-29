import { CreateTicketUseCase } from '../../application/use-cases/tickets/create-ticket.use-case';
import { InMemoryTicketRepository } from '../../infrastructure/persistence/in-memory/in-memory-ticket.repository';
import { FakeMessageQueueAdapter } from '../../infrastructure/messaging/fake/fake-message-queue.adapter';

export function makeCreateTicketUseCase() {
  const ticketRepository = new InMemoryTicketRepository();
  const messageQueue = new FakeMessageQueueAdapter();

  return new CreateTicketUseCase(ticketRepository, messageQueue);
}
