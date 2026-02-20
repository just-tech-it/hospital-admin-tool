import React from 'react';
import Header from './Hearder'; // Matching your filename typo "Hearder"
import Alerts from './Alerts';
import BedManager from './BedManager';
import ShiftManager from './ShiftManager';

const Dashboard = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Header />
      <Alerts />
      <main style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <BedManager />
          <ShiftManager />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;