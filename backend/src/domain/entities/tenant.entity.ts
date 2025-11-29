export interface TenantProps {
  id: string;
  name: string;
  createdAt: Date;
}

export class Tenant {
  constructor(private props: TenantProps) {}

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
