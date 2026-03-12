import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const BedManager = () => {
  const { beds, updateBed } = useContext(AppContext);
  const [statusFilter, setStatusFilter] = useState("all");
  const [patientInputs, setPatientInputs] = useState({}); // store temporary patient names

  const filteredBeds = beds.filter(bed => statusFilter === "all" || bed.status.toLowerCase() === statusFilter);

  return (
    <section style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Bed Management</h2>
        <div style={{ display: 'flex', gap: '5px' }}>
          {['all','available','occupied'].map(status => (
            <button key={status} onClick={() => setStatusFilter(status)}
              style={{ padding:'5px 12px', borderRadius:'20px', backgroundColor: statusFilter===status?'#2c3e50':'#fff', color: statusFilter===status?'#fff':'#2c3e50', border:'1px solid #ddd', textTransform:'capitalize' }}>
              {status}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:'15px' }}>
        {filteredBeds.map(bed => (
          <div key={bed.id} style={{ padding:'15px', borderRadius:'8px', border:`2px solid ${bed.status==='occupied'?'#feb2b2':'#9ae6b4'}`, textAlign:'center', background:bed.status==='occupied'?'#fff5f5':'#f0fff4' }}>
            <div style={{ fontSize:'0.8rem', color:'#4a5568' }}>BED</div>
            <div style={{ fontSize:'1.2rem', fontWeight:'bold' }}>{bed.id}</div>

            {/* Show patient info */}
            {bed.patient && <div style={{ fontSize:'0.75rem', color:'#4a5568', marginTop:'5px' }}>
              {bed.patient.name} ({bed.patient.condition})
            </div>}

            {/* Input for assigning patient */}
            {bed.status==='available' && (
              <>
                <input
                  type="text"
                  placeholder="Patient name"
                  value={patientInputs[bed.id] || ''}
                  onChange={e => setPatientInputs({...patientInputs, [bed.id]: e.target.value})}
                  style={{ marginTop:'5px', width:'100%', padding:'4px', fontSize:'0.7rem' }}
                />
              </>
            )}

            <button onClick={() => {
              if(bed.status==='occupied'){
                updateBed({ ...bed, status:'available', patient:null });
              } else {
                updateBed({ ...bed, status:'occupied', patient:{ name: patientInputs[bed.id] || 'Anonymous', condition:'Observation' }});
                setPatientInputs({...patientInputs, [bed.id]: ''});
              }
            }} style={{ marginTop:'10px', width:'100%', fontSize:'0.7rem', cursor:'pointer' }}>
              {bed.status==='occupied'?'Discharge':'Admit'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BedManager;