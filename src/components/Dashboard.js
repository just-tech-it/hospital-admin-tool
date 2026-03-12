import Header from "./Header";
import Alerts from "./Alerts";
import BedManager from "./BedManager";
import ShiftManager from "./ShiftManager";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <Alerts />
      <main style={{ padding: '20px' }}>
        <BedManager />
        <ShiftManager />
      </main>
    </div>
  );
};

export default Dashboard;