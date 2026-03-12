import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ActivityLog = () => {
  const { logs } = useContext(AppContext);

  return (
    <aside style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <h3 style={{ marginTop: 0, fontSize: '1rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Recent Activity</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {logs.length === 0 && <small style={{ color: '#94a3b8' }}>Waiting for activity...</small>}
        {logs.map(log => (
          <div key={log.id} style={{ fontSize: '0.8rem', borderLeft: '3px solid #3b82f6', paddingLeft: '10px' }}>
            <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{log.timestamp}</div>
            <div style={{ color: '#1e293b' }}>{log.message}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ActivityLog;