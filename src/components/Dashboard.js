import React from 'react';
import Header from "./Header";
import StatsCards from "./StatsCards";
import BedManager from "./BedManager";
import ShiftManager from "./ShiftManager";
import ActivityLog from "./ActivityLog";
import BedOccupancyChart from "./BedOccupancyChart";
import StaffCoverageChart from "./StaffCoverageChart";

const Dashboard = () => {
  return (
    <div style={{ backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <Header />
      
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Stats */}
        <StatsCards />

        {/* Charts Section */}
        <div style={{ display:"flex", gap:"20px", marginBottom:"20px" }}>
          <BedOccupancyChart />
          <StaffCoverageChart />
        </div>

        {/* Main Dashboard Grid */}
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