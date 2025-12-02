import { CallNextTicketUseCase } from '../../application/use-cases/tickets/call-next-ticket.use-case';
import { InMemoryTicketRepository } from '../../infrastructure/persistence/in-memory/in-memory-ticket.repository';
import { FakeMessageQueueAdapter } from '../../infrastructure/messaging/fake/fake-message-queue.adapter';
import { makeWebSocketGateway } from '../../infrastructure/websocket/ws-gateway';
import { makeRabbitMQAdapter } from './make-rabbitmq-adapter';
import { io } from '../server';

export function makeCallNextTicketUseCase() {
  const ticketRepository = new InMemoryTicketRepository();
  const messageQueue = makeRabbitMQAdapter();
  const wsGateway = makeWebSocketGateway(io);

  return new CallNextTicketUseCase(ticketRepository, messageQueue, wsGateway);
}
