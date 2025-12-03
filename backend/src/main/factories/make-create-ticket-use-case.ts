import { CreateTicketUseCase } from '../../application/use-cases/tickets/create-ticket.use-case';
import { PrismaTicketRepository } from '../../infrastructure/persistence/prisma/prisma-ticket.repository';
import { makeRabbitMQAdapter } from './make-rabbitmq-adapter';
import { makeWebSocketGateway } from '../../infrastructure/websocket/ws-gateway';
import { io } from '../server';
import { getPrismaClient } from '../../infrastructure/persistence/prisma/prisma-client';

export function makeCreateTicketUseCase() {
  const prisma = getPrismaClient();
  const ticketRepository = new PrismaTicketRepository(prisma);
  const messageQueue = makeRabbitMQAdapter();
  const wsGateway = makeWebSocketGateway(io);
  return new CreateTicketUseCase(ticketRepository, messageQueue, wsGateway);
}
