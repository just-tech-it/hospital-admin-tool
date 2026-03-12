
import { AppContext } from '../context/AppContext';

const ActivityLog = () => {
  const { logs } = useContext(AppContext);

  return (
    <aside style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ marginTop: 0, fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Live Activity</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {logs.length === 0 && <small style={{ color: '#94a3b8' }}>No recent activity</small>}
        {logs.map(log => (
          <div key={log.id} style={{ fontSize: '0.85rem', borderLeft: '3px solid #3b82f6', paddingLeft: '10px' }}>
            <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{log.timestamp}</div>
            <div style={{ color: '#1e293b' }}>{log.message}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ActivityLog;