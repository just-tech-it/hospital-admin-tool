import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const StatsCards = () => {
  const { stats } = useContext(AppContext);

  const cardStyle = {
    padding: '1.5rem',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    flex: 1,
    minWidth: '200px'
  };

  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <div style={cardStyle}>
        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>ACTIVE STAFF</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.activeStaff}</div>
      </div>
      <div style={cardStyle}>
        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>STAFF : PATIENT</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: stats.staffToPatientRatio < 0.2 ? '#e53e3e' : '#2d3748' }}>
          {stats.staffToPatientRatio}
        </div>
      </div>
      <div style={cardStyle}>
        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>AVAILABLE BEDS</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.availableBeds}</div>
      </div>
    </div>
  );
};

export default StatsCards;