import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const StaffCoverageChart = () => {
  const { stats } = useContext(AppContext);

  const data = [
    { name: "Active Staff", count: stats.activeStaff },
    { name: "Occupied Beds", count: stats.occupiedBeds }
  ];

  return (
    <div>
      <h3>Staff Coverage</h3>
      <ResponsiveContainer width={250} height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StaffCoverageChart;