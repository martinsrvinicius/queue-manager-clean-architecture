import { Tenant } from './tenant.entity';

export type TicketStatus = 'WAITING' | 'CALLING' | 'IN_SERVICE' | 'FINISHED';

export interface TicketProps {
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

export class Ticket {
  constructor(private props: TicketProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get queueId(): string { return this.props.queueId; }
  get number(): number { return this.props.number; }
  get customerName(): string { return this.props.customerName; }
  get status(): TicketStatus { return this.props.status; }
  get createdAt(): Date { return this.props.createdAt; }
  get calledAt(): Date | undefined { return this.props.calledAt; }
  get finishedAt(): Date | undefined { return this.props.finishedAt; }

  call(): void {
    if (this.props.status !== 'WAITING') {
      throw new Error('Ticket can only be called when WAITING');
    }
    this.props.status = 'CALLING';
    this.props.calledAt = new Date();
  }

  startService(): void {
    if (this.props.status !== 'CALLING') {
      throw new Error('Ticket must be called first');
    }
    this.props.status = 'IN_SERVICE';
  }

  finish(): void {
    if (this.props.status !== 'IN_SERVICE') {
      throw new Error('Ticket must be in service to finish');
    }
    this.props.status = 'FINISHED';
    this.props.finishedAt = new Date();
  }

  get waitingTimeMs(): number {
    return this.props.status === 'FINISHED' 
      ? this.props.calledAt!.getTime() - this.props.createdAt.getTime()
      : 0;
  }
}
