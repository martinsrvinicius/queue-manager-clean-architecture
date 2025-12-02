import { useState } from 'react';
import { useQueue } from '../hooks/useQueue';

interface Props {
  tenantId: string;
  queueId: string;
}

export default function DoctorView({ tenantId, queueId }: Props) {
  const { callNextTicket, finishTicket, tickets, isConnected } = useQueue(tenantId, queueId);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const callingTicket = tickets.find(t => t.status === 'CALLING');

  return (
    <div>
      <button 
        className="btn" 
        onClick={callNextTicket}
        disabled={!isConnected || callingTicket !== undefined}
      >
        📞 Call Next Patient
      </button>

      {callingTicket && (
        <div className="ticket status-calling">
          <strong>Now serving:</strong><br />
          #{callingTicket.number} - {callingTicket.customerName}
        </div>
      )}

      <h4 style={{ margin: '20px 0 10px 0' }}>Finish current:</h4>
      {callingTicket && (
        <button 
          className="btn" 
          onClick={() => {
            finishTicket(callingTicket.ticketId);
            setSelectedTicket(null);
          }}
          disabled={!isConnected}
        >
          ✅ Finish Consultation
        </button>
      )}
    </div>
  );
}
