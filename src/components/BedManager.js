import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const BedManager = () => {
  const { beds, updateBed, addLog } = useContext(AppContext);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBeds = beds.filter(bed =>
    statusFilter === "all" || bed.status.toLowerCase() === statusFilter
  );

  // Assign a patient to a bed
  const assignPatient = (bed) => {
    const name = prompt("Enter patient name:");
    if (!name) return;

    const condition = prompt("Enter patient condition:");
    if (!condition) return;

    updateBed({
      ...bed,
      status: 'occupied',
      patient: { name, condition }
    });
    addLog({ 
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      message: `Patient "${name}" assigned to Bed ${bed.id}`
    });
  };

  // Remove patient and mark bed available
  const dischargePatient = (bed) => {
    updateBed({
      ...bed,
      status: 'available',
      patient: null
    });
    addLog({
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      message: `Bed ${bed.id} is now available`
    });
  };

  return (
    <section style={{ padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Bed Management</h2>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['all', 'available', 'occupied'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '5px 12px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                backgroundColor: statusFilter === status ? '#2c3e50' : '#fff',
                color: statusFilter === status ? '#fff' : '#2c3e50',
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
        {filteredBeds.map(bed => (
          <div key={bed.id} style={{ 
            padding: '15px', 
            borderRadius: '8px',
            border: `2px solid ${bed.status === 'occupied' ? '#feb2b2' : '#9ae6b4'}`,
            textAlign: 'center',
            background: bed.status === 'occupied' ? '#fff5f5' : '#f0fff4'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#4a5568' }}>BED {bed.id}</div>

            {bed.status === 'occupied' && bed.patient ? (
              <>
                <div style={{ margin: '8px 0', fontWeight: '600' }}>{bed.patient.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '8px' }}>{bed.patient.condition}</div>
                <button
                  onClick={() => dischargePatient(bed)}
                  style={{ width: '100%', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Discharge Patient
                </button>
              </>
            ) : (
              <button
                onClick={() => assignPatient(bed)}
                style={{ width: '100%', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                Admit Patient
              </button>
            )}

          </div>
        ))}
      </div>
    </section>
  );
};

export default BedManager;