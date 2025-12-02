export interface DomainEvent {
  tenantId: string;
  domain: string;        // ex: "tickets", "accounts", "flights"
  eventType: string;     // ex: "created", "updated", "called", "finished"
  entityId: string;      // id do recurso, ex: ticketId, accountId
  data: Record<string, unknown>;  // payload flexível
}
