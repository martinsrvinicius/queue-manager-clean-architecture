import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export function initWsServer(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Cliente escolhe assinar rooms por tenant/queue
    socket.on('subscribe', (room: string) => {
      console.log(`Socket ${socket.id} subscribed to ${room}`);
      socket.join(room);
    });

    socket.on('unsubscribe', (room: string) => {
      console.log(`Socket ${socket.id} unsubscribed from ${room}`);
      socket.leave(room);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
