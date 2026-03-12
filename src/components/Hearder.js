const Header = () => {
  const { stats } = useContext(AppContext);
  
  // Dynamic color based on occupancy level
  const statusColor = stats.occupancyRatio > 0.9 ? '#e74c3c' : stats.occupancyRatio > 0.7 ? '#f39c12' : '#2ecc71';

  return (
    <header style={{ 
      padding: '1rem 2rem', 
      background: '#ffffff', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '1.5rem' }}>🏥 Clinical Command Center</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>LIVE OCCUPANCY</div>
          <div style={{ fontWeight: 'bold', color: statusColor }}>
            {stats.occupiedBeds} / {stats.totalBeds} ({Math.round(stats.occupancyRatio * 100)}%)
          </div>
        </div>
        <div style={{ 
          width: '12px', 
          height: '12px', 
          borderRadius: '50%', 
          backgroundColor: statusColor,
          boxShadow: `0 0 8px ${statusColor}` 
        }} />
      </div>
    </header>
  );
};