import { useQueue } from '../hooks/useQueue';

interface Props {
  tenantId: string;
  queueId: string;
}

export default function DashboardView({ tenantId, queueId }: Props) {
  const { metrics, isConnected } = useQueue(tenantId, queueId);

  return (
    <div>
      <div className="metric-card">
        <h3>⏳ Waiting</h3>
        <div className="metric-number">{metrics.waitingCount}</div>
      </div>
      <div className="metric-card">
        <h3>📞 Calling</h3>
        <div className="metric-number">{metrics.callingCount}</div>
      </div>
      <div className="metric-card">
        <h3>✅ Finished</h3>
        <div className="metric-number">{metrics.finishedCount}</div>
      </div>
      <div style={{ marginTop: 20, padding: '10px', background: '#f3f4f6', borderRadius: '8px' }}>
        <div>WebSocket: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</div>
      </div>
    </div>
  );
}
