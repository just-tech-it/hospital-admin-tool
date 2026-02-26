import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Alerts = () => {
  const { alerts } = useContext(AppContext);

  if (alerts.length === 0) return null;

  return (
    <div style={{ padding: "20px" }}>
      {alerts.map(alert => (
        <div
          key={alert.id}
          className={`alert alert-${alert.type}`}
          style={{
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px",
            backgroundColor: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba"
          }}
        >
          {alert.message}
        </div>
      ))}
    </div>
  );
};

export default Alerts;