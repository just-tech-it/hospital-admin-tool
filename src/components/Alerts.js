import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Alerts = () => {
  const { alerts } = useContext(AppContext);

  if (!alerts.length) return null;

  return (
    <div style={{ padding: "20px" }}>
      {alerts.map(({ id, type, message }) => (
        <div
          key={id}
          className={`alert alert-${type}`}
          style={{
            padding: "12px",
            marginBottom: "10px",
            borderRadius: "6px",
            backgroundColor: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba",
          }}
        >
          {message}
        </div>
      ))}
    </div>
  );
};

export default Alerts;