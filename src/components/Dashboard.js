import Header from "./Header";
import Alerts from "./Alerts";
import BedManager from "./BedManager";
import ShiftManager from "./ShiftManager";

const Dashboard = () => {
  return (
    <div className="app-container" style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Alerts />
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '20px',
          marginTop: '20px' 
        }}>
          <BedManager />
          <ShiftManager />
        </div>
      </div>
    </div>
  );
};