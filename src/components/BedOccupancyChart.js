import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const BedOccupancyChart = () => {
  const { stats } = useContext(AppContext);

  const data = [
    { name: "Occupied", value: stats.occupiedBeds, color: "#f87171" },
    { name: "Available", value: stats.availableBeds, color: "#86efac" }
  ];

  return (
    <div>
      <h3>Bed Occupancy</h3>
      <PieChart width={250} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </div>
  );
};

export default BedOccupancyChart;