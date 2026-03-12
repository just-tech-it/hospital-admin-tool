import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const BedManager = () => {
  const { beds, assignPatient, dischargePatient } = useContext(AppContext);
  const [statusFilter, setStatusFilter] = useState("all");
  const [patientNames, setPatientNames] = useState({});

  const filteredBeds = beds.filter(
    bed => statusFilter === "all" || bed.status.toLowerCase() === statusFilter
  );

  const handleAssign = (bedId) => {
    const name = patientNames[bedId];
    if (!name) return;

    assignPatient(bedId, {
      name,
      condition: "Observation"
    });

    setPatientNames(prev => ({ ...prev, [bedId]: "" }));
  };

  return (
    <section style={{ padding:'1.5rem', background:'#fff', borderRadius:'12px', boxShadow:'0 4px 6px rgba(0,0,0,0.05)' }}>
      
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem', alignItems:'center' }}>
        <h2 style={{ margin:0 }}>Bed Management</h2>

        <div style={{ display:'flex', gap:'5px' }}>
          {['all','available','occupied'].map(status => (
            <button
              key={status}
              onClick={()=>setStatusFilter(status)}
              style={{
                padding:'5px 12px',
                borderRadius:'20px',
                border:'1px solid #ddd',
                backgroundColor: statusFilter===status ? '#2c3e50':'#fff',
                color: statusFilter===status ? '#fff':'#2c3e50',
                textTransform:'capitalize',
                cursor:'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'15px' }}>

        {filteredBeds.map(bed => (

          <div
            key={bed.id}
            style={{
              padding:'15px',
              borderRadius:'8px',
              border:`2px solid ${bed.status==='occupied' ? '#feb2b2':'#9ae6b4'}`,
              background: bed.status==='occupied' ? '#fff5f5':'#f0fff4'
            }}
          >

            <div style={{ fontSize:'0.75rem', color:'#4a5568' }}>BED</div>
            <div style={{ fontSize:'1.3rem', fontWeight:'bold' }}>{bed.id}</div>

            {bed.status === "occupied" && bed.patient && (
              <div style={{ fontSize:'0.8rem', marginTop:'6px' }}>
                👤 {bed.patient.name}
              </div>
            )}

            {bed.status === "available" && (
              <>
                <input
                  placeholder="Patient name"
                  value={patientNames[bed.id] || ""}
                  onChange={(e)=>setPatientNames({
                    ...patientNames,
                    [bed.id]:e.target.value
                  })}
                  style={{
                    width:'100%',
                    marginTop:'6px',
                    padding:'4px',
                    fontSize:'0.75rem'
                  }}
                />

                <button
                  onClick={()=>handleAssign(bed.id)}
                  style={{
                    marginTop:'6px',
                    width:'100%',
                    fontSize:'0.75rem',
                    cursor:'pointer'
                  }}
                >
                  Admit
                </button>
              </>
            )}

            {bed.status === "occupied" && (
              <button
                onClick={()=>dischargePatient(bed.id)}
                style={{
                  marginTop:'8px',
                  width:'100%',
                  fontSize:'0.75rem',
                  cursor:'pointer'
                }}
              >
                Discharge
              </button>
            )}

          </div>

        ))}

      </div>

    </section>
  );
};

export default BedManager;