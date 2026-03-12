import React from 'react';
import Header from "./Hearder"; // Match your current filename typo for now
import StatsCards from "./StatsCards";
import BedManager from "./BedManager";
import ShiftManager from "./ShiftManager";
import ActivityLog from "./ActivityLog";

const Dashboard = () => {
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <Header />
      
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* This is the first part of the upgrade! */}
        <StatsCards /> 
        
        {/* This CSS Grid is the second part of the upgrade! */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1.2fr 1fr 300px', 
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