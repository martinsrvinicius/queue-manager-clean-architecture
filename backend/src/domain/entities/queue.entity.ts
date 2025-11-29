import { Tenant } from './tenant.entity';

export interface QueueProps {
  id: string;
  tenantId: string;
  branchId: string;
  name: string;
  isActive: boolean;
  createdAt: Date;
}

export class Queue {
  constructor(private props: QueueProps) {}

  get id(): string { return this.props.id; }
  get tenantId(): string { return this.props.tenantId; }
  get branchId(): string { return this.props.branchId; }
  get name(): string { return this.props.name; }
  get isActive(): boolean { return this.props.isActive; }
  get createdAt(): Date { return this.props.createdAt; }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }
}
