import { Server } from 'socket.io';
import { IWebSocketGateway } from '../../application/interfaces/websocket-gateway.interface';

export class WebSocketGateway implements IWebSocketGateway {
  constructor(private io: Server) {}

  emitToQueue(event: string, data: any, tenantId: string, queueId: string): void {
    const room = `tenant:${tenantId}:queue:${queueId}`;
    console.log(`📡 WS emitting ${event} to room ${room}:`, data);
    this.io.to(room).emit(event, data);
  }
}

export function makeWebSocketGateway(io: Server): WebSocketGateway {
  return new WebSocketGateway(io);
}
