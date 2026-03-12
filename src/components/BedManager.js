import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const BedManager = () => {
  const { beds, updateBed } = useContext(AppContext);
  const [statusFilter, setStatusFilter] = useState("all");
  const [patientNames, setPatientNames] = useState({}); // Temp input values

  const filteredBeds = beds.filter(bed =>
    statusFilter === "all" || bed.status.toLowerCase() === statusFilter
  );

  const handleAdmit = (bed) => {
    if (!patientNames[bed.id] || patientNames[bed.id].trim() === "") {
      alert("Enter patient name to admit");
      return;
    }
    updateBed({
      ...bed,
      status: "occupied",
      patient: { name: patientNames[bed.id], condition: "Observation" }
    });
    setPatientNames({ ...patientNames, [bed.id]: "" });
  };

  const handleDischarge = (bed) => {
    updateBed({ ...bed, status: "available", patient: null });
  };

  return (
    <section style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2>Bed Management</h2>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['all','available','occupied'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                backgroundColor: statusFilter === status ? '#2c3e50' : '#fff',
                color: statusFilter === status ? '#fff' : '#2c3e50',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
        {filteredBeds.map(bed => (
          <div key={bed.id} style={{
            padding: '15px',
            borderRadius: '8px',
            border: `2px solid ${bed.status === 'occupied' ? '#feb2b2' : '#9ae6b4'}`,
            background: bed.status === 'occupied' ? '#fff5f5' : '#f0fff4'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#4a5568' }}>BED {bed.id}</div>
            {bed.status === "occupied" && bed.patient ? (
              <div style={{ margin: '8px 0', fontSize: '0.9rem', color: '#2c3e50' }}>
                <div><strong>Patient:</strong> {bed.patient.name}</div>
                <div><strong>Condition:</strong> {bed.patient.condition}</div>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Patient name"
                value={patientNames[bed.id] || ""}
                onChange={(e) => setPatientNames({ ...patientNames, [bed.id]: e.target.value })}
                style={{ width: '100%', padding: '6px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            )}

            <button
              onClick={() => bed.status === 'occupied' ? handleDischarge(bed) : handleAdmit(bed)}
              style={{ marginTop: '10px', width: '100%', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              {bed.status === 'occupied' ? 'Discharge' : 'Admit'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BedManager;