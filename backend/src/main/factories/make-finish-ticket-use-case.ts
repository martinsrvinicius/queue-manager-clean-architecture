import { PrismaTicketRepository } from '../../infrastructure/persistence/prisma/prisma-ticket.repository';
import { FinishTicketUseCase } from '../../application/use-cases/tickets/finish-ticket.use-case';
import { InMemoryTicketRepository } from '../../infrastructure/persistence/in-memory/in-memory-ticket.repository';
import { FakeMessageQueueAdapter } from '../../infrastructure/messaging/fake/fake-message-queue.adapter';
import { makeWebSocketGateway } from '../../infrastructure/websocket/ws-gateway';
import { makeRabbitMQAdapter } from './make-rabbitmq-adapter';
import { io } from '../server';
import { getPrismaClient } from '../../infrastructure/persistence/prisma/prisma-client';

export function makeFinishTicketUseCase() {
  const prisma = getPrismaClient();
  const ticketRepository = new PrismaTicketRepository(prisma);
  const messageQueue = makeRabbitMQAdapter();
  const wsGateway = makeWebSocketGateway(io);

  return new FinishTicketUseCase(ticketRepository, messageQueue, wsGateway);
}
