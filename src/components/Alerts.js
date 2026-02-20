import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Alerts = () => {
  const { alerts } = useContext(AppContext);

  if (alerts.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
      {alerts.map(alert => (
        <div key={alert.id} style={{ 
          background: '#ff4444', 
          color: 'white', 
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
        }}>
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default Alerts;