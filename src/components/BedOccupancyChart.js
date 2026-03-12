import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const BedOccupancyChart = () => {

  const { stats } = useContext(AppContext);

  const data = [
    { name: "Occupied", value: stats.occupiedBeds },
    { name: "Available", value: stats.availableBeds }
  ];

  const COLORS = ["#e53e3e", "#38a169"];

  return (
    <div style={{ background:"#fff", padding:"1rem", borderRadius:"10px" }}>
      <h3>Bed Occupancy</h3>

      <PieChart width={250} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </div>
  );
};

export default BedOccupancyChart;