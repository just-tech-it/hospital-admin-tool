import React from 'react';
import Header from "./Header";
import Alerts from "./Alerts";
import BedManager from "./BedManager";
import ShiftManager from "./ShiftManager";
import ActivityLog from "./ActivityLog";
import StatsCards from "./StatsCards";

const Dashboard = () => {
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <Header />
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <Alerts />
        <StatsCards />
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr 280px', // 3 Columns!
          gap: '20px',
          alignItems: 'start'
        }}>
          <BedManager />
          <ShiftManager />
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;