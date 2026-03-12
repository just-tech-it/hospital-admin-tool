import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const BedManager = () => {
  const { beds, updateBed } = useContext(AppContext);
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBeds = beds.filter(bed => 
    statusFilter === "all" || bed.status.toLowerCase() === statusFilter
  );

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '15px' }}>
        {filteredBeds.map(bed => (
          <div key={bed.id} style={{ 
            padding: '15px', 
            borderRadius: '8px',
            border: `2px solid ${bed.status === 'occupied' ? '#feb2b2' : '#9ae6b4'}`,
            textAlign: 'center',
            background: bed.status === 'occupied' ? '#fff5f5' : '#f0fff4'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#4a5568' }}>BED</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{bed.id}</div>
            <button 
              onClick={() => updateBed({...bed, status: bed.status === 'occupied' ? 'available' : 'occupied'})}
              style={{ marginTop: '10px', width: '100%', fontSize: '0.7rem', cursor: 'pointer' }}
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