import { CallNextTicketUseCase } from '../../application/use-cases/tickets/call-next-ticket.use-case';
import { PrismaTicketRepository } from '../../infrastructure/persistence/prisma/prisma-ticket.repository';
import { makeWebSocketGateway } from '../../infrastructure/websocket/ws-gateway';
import { makeRabbitMQAdapter } from './make-rabbitmq-adapter';
import { io } from '../server';
import { getPrismaClient } from '../../infrastructure/persistence/prisma/prisma-client';

export function makeCallNextTicketUseCase() {
  const prisma = getPrismaClient();
  const ticketRepository = new PrismaTicketRepository(prisma);
  const messageQueue = makeRabbitMQAdapter();
  const wsGateway = makeWebSocketGateway(io);

  return new CallNextTicketUseCase(ticketRepository, messageQueue, wsGateway);
}
