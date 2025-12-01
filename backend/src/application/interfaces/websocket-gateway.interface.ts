export interface IWebSocketGateway {
  emitToQueue(event: string, data: any, tenantId: string, queueId: string): void;
}
