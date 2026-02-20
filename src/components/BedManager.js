import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const BedManager = () => {
  const { beds, updateBed } = useContext(AppContext);

  const toggleStatus = (bed) => {
    const newStatus = bed.status === 'occupied' ? 'available' : 'occupied';
    updateBed({ ...bed, status: newStatus });
  };

  return (
    <section style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Bed Management</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
        {beds.map(bed => (
          <div key={bed.id} style={{ 
            padding: '10px', 
            border: '1px solid #ccc', 
            textAlign: 'center',
            background: bed.status === 'occupied' ? '#ffdada' : '#daffda' 
          }}>
            <div>Bed {bed.id}</div>
            <button onClick={() => toggleStatus(bed)}>
              {bed.status === 'occupied' ? 'Discharge' : 'Admit'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BedManager;