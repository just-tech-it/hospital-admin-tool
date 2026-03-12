import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const StaffCoverageChart = () => {

  const { shifts } = useContext(AppContext);

  const roleCounts = shifts.reduce((acc, shift) => {

    acc[shift.role] = (acc[shift.role] || 0) + (shift.checkedIn ? 1 : 0);

    return acc;

  }, {});

  const data = Object.keys(roleCounts).map(role => ({
    role,
    staff: roleCounts[role]
  }));

  return (
    <div style={{ background:"#fff", padding:"1rem", borderRadius:"10px" }}>
      <h3>Staff Coverage</h3>

      <BarChart width={300} height={250} data={data}>
        <XAxis dataKey="role"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="staff" fill="#3182ce"/>
      </BarChart>

    </div>
  );
};

export default StaffCoverageChart;