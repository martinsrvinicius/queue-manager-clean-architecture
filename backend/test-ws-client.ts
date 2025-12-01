import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Connected with socket id:', socket.id);

  // Subscribing to a room (exemplo multi-tenant)
  const room = 'tenant:123e4567-e89b-12d3-a456-426614174000:queue:123e4567-e89b-12d3-a456-426614174001';
  socket.emit('subscribe', room);
  console.log(`📡 Subscribed to room: ${room}`);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

// Ouvir qualquer evento do servidor (exemplo)
socket.on('ticket.created', (data) => {
  console.log('🎟️ Ticket created event:', data);
});

socket.on('ticket.called', (data) => {
  console.log('📞 Ticket called event:', data);
});

socket.on('ticket.finished', (data) => {
  console.log('✅ Ticket finished event:', data);
});
