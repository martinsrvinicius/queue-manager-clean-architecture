import { useQueue } from '../hooks/useQueue';

interface Props {
  tenantId: string;
  queueId: string;
}

export default function WaitingRoomView({ tenantId, queueId }: Props) {
  const { tickets, isConnected } = useQueue(tenantId, queueId);

  const waitingTickets = tickets.filter(t => t.status === 'WAITING');
  const callingTickets = tickets.filter(t => t.status === 'CALLING');

  return (
    <div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
        NOW SERVING
      </div>
      
      {callingTickets.map(ticket => (
        <div key={ticket.ticketId} className="ticket status-calling" style={{ fontSize: '28px', marginBottom: 20 }}>
          <div style={{ fontSize: '36px' }}># {ticket.number}</div>
          <div>{ticket.customerName}</div>
        </div>
      ))}

      <div style={{ fontSize: '20px', marginBottom: 15 }}>Next in line:</div>
      {waitingTickets.slice(0, 5).map(ticket => (
        <div key={ticket.ticketId} className="ticket status-waiting">
          #{ticket.number} - {ticket.customerName}
        </div>
      ))}
      
      {waitingTickets.length === 0 && (
        <div style={{ color: '#6b7280', textAlign: 'center', padding: '40px' }}>
          No one waiting...
        </div>
      )}
    </div>
  );
}
