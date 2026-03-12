import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const BedManager = () => {
  const { beds, updateBed } = useContext(AppContext);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBeds = beds.filter(
    bed => statusFilter === "all" || bed.status.toLowerCase() === statusFilter
  );

  return (
    <section
      style={{
        padding: "1.5rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem"
        }}
      >
        <h2 style={{ margin: 0 }}>Bed Management</h2>
        <div style={{ display: "flex", gap: "5px" }}>
          {["all", "available", "occupied"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: "5px 12px",
                borderRadius: "20px",
                border: "1px solid #ddd",
                backgroundColor: statusFilter === status ? "#2c3e50" : "#fff",
                color: statusFilter === status ? "#fff" : "#2c3e50",
                textTransform: "capitalize",
                cursor: "pointer"
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          gap: "15px"
        }}
      >
        {filteredBeds.map(bed => (
          <div
            key={bed.id}
            style={{
              padding: "15px",
              borderRadius: "8px",
              border: `2px solid ${bed.status === "occupied" ? "#feb2b2" : "#9ae6b4"}`,
              textAlign: "center",
              background: bed.status === "occupied" ? "#fff5f5" : "#f0fff4"
            }}
          >
            <div style={{ fontSize: "0.8rem", color: "#4a5568" }}>Bed {bed.id}</div>

            {bed.status === "occupied" ? (
              <>
                <div>
                  <strong>Patient:</strong> {bed.patient?.name || "Unknown"}
                </div>
                <button
                  onClick={() => updateBed({ ...bed, status: "available", patient: null })}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    fontSize: "0.7rem",
                    cursor: "pointer"
                  }}
                >
                  Discharge
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={bed.patient?.name || ""}
                  onChange={e => updateBed({ ...bed, patient: { name: e.target.value } })}
                  style={{
                    width: "100%",
                    marginBottom: "8px",
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                />
                <button
                  disabled={!bed.patient?.name}
                  onClick={() => updateBed({ ...bed, status: "occupied" })}
                  style={{
                    width: "100%",
                    fontSize: "0.7rem",
                    cursor: bed.patient?.name ? "pointer" : "not-allowed"
                  }}
                >
                  Admit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BedManager;