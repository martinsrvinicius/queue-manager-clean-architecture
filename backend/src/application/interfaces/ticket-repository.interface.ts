export type TicketStatus = 'WAITING' | 'CALLING' | 'IN_SERVICE' | 'FINISHED';

export interface CreateTicketData {
  tenantId: string;
  queueId: string;
  customerName: string;
  status: TicketStatus;
}

export interface TicketModel {
  id: string;
  tenantId: string;
  queueId: string;
  number: number;
  customerName: string;
  status: TicketStatus;
  createdAt: Date;
  calledAt?: Date;
  finishedAt?: Date;
}

export interface ITicketRepository {
  create(data: CreateTicketData): Promise<TicketModel>;
  findNextWaiting(tenantId: string, queueId: string): Promise<TicketModel | null>;

  callNextTicket(ticketId: string): Promise<TicketModel>;

  finishTicket(ticketId: string): Promise<TicketModel>;
}
