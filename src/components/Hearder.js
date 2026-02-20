import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { beds } = useContext(AppContext);
  const occupiedCount = beds.filter(b => b.status === "occupied").length;

  return (
    <header style={{ padding: '1rem', background: '#2c3e50', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
      <h1>Clinical Dashboard</h1>
      <div>
        <strong>Ward Status:</strong> {occupiedCount} / {beds.length} Beds Occupied
      </div>
    </header>
  );
};

export default Header;