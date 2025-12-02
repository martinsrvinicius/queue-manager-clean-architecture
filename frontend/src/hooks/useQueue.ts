import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface Ticket {
  ticketId: string;
  number: number;
  customerName: string;
  status: 'WAITING' | 'CALLING' | 'FINISHED';
}

interface QueueMetrics {
  waitingCount: number;
  callingCount: number;
  finishedCount: number;
}

export const useQueue = (tenantId: string, queueId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [metrics, setMetrics] = useState<QueueMetrics>({ waitingCount: 0, callingCount: 0, finishedCount: 0 });
  const [isConnected, setIsConnected] = useState(false);

  const room = `tenant:${tenantId}:queue:${queueId}`;

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      newSocket.emit('subscribe', room);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    // Listeners para eventos
    newSocket.on('ticket.created', (data: any) => {
      setTickets(prev => [{ ticketId: data.ticketId, number: data.number, customerName: data.customerName, status: 'WAITING' }, ...prev]);
    });

    newSocket.on('ticket.called', (data: any) => {
      setTickets(prev => prev.map(t => 
        t.ticketId === data.ticketId 
          ? { ...t, status: 'CALLING' }
          : t
      ));
    });

    newSocket.on('ticket.finished', (data: any) => {
      setTickets(prev => prev.map(t => 
        t.ticketId === data.ticketId 
          ? { ...t, status: 'FINISHED' }
          : t
      ));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [room]);

  // Atualiza métricas
  useEffect(() => {
    const waiting = tickets.filter(t => t.status === 'WAITING').length;
    const calling = tickets.filter(t => t.status === 'CALLING').length;
    const finished = tickets.filter(t => t.status === 'FINISHED').length;
    
    setMetrics({ waitingCount: waiting, callingCount: calling, finishedCount: finished });
  }, [tickets]);

  const callNextTicket = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/tickets/call-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, queueId }),
      });
      if (!response.ok) throw new Error('Failed to call next');
    } catch (error) {
      console.error('Error calling next ticket:', error);
    }
  };

  const finishTicket = async (ticketId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/tickets/${ticketId}/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId }),
      });
      if (!response.ok) throw new Error('Failed to finish ticket');
    } catch (error) {
      console.error('Error finishing ticket:', error);
    }
  };

  const takeTicket = async (customerName: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, queueId, customerName }),
      });
      if (!response.ok) throw new Error('Failed to take ticket');
    } catch (error) {
      console.error('Error taking ticket:', error);
    }
  };

  return {
    tickets,
    metrics,
    isConnected,
    callNextTicket,
    finishTicket,
    takeTicket,
  };
};
