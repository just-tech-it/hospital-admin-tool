import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

const ShiftManager = () => {

  const { shifts, updateShift } = useContext(AppContext);

  const [searchTerm,setSearchTerm] = useState("");
  const [filterRole,setFilterRole] = useState("All");

  const filteredShifts = shifts.filter(shift => {

    const matchesSearch =
      shift.staffName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "All" || shift.role === filterRole;

    return matchesSearch && matchesRole;

  });

  const roles = ["All", ...new Set(shifts.map(s => s.role))];

  const activeStaff = shifts.filter(s => s.checkedIn).length;

  return (

    <section style={{ padding:'1.5rem', background:'#fff', borderRadius:'12px', boxShadow:'0 4px 6px rgba(0,0,0,0.05)' }}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>

        <div>
          <h2 style={{ margin:0 }}>Staffing Overview</h2>
          <small style={{ color:'#718096' }}>
            {activeStaff} staff currently on-site
          </small>
        </div>

        <div style={{ display:'flex', gap:'10px' }}>

          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            style={{ padding:'8px', borderRadius:'6px', border:'1px solid #ddd' }}
          />

          <select
            value={filterRole}
            onChange={(e)=>setFilterRole(e.target.value)}
            style={{ padding:'8px', borderRadius:'6px', border:'1px solid #ddd' }}
          >

            {roles.map(role => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}

          </select>

        </div>

      </div>

      <table style={{ width:'100%', borderCollapse:'collapse' }}>

        <thead>
          <tr style={{ textAlign:'left', color:'#7f8c8d', borderBottom:'2px solid #f4f7f6' }}>
            <th style={{ padding:'12px' }}>Staff Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredShifts.length === 0 && (
            <tr>
              <td colSpan="4" style={{ padding:'12px', textAlign:'center', color:'#718096' }}>
                No staff found
              </td>
            </tr>
          )}

          {filteredShifts.map(shift => (

            <tr key={shift.id} style={{ borderBottom:'1px solid #f4f7f6' }}>

              <td style={{ padding:'12px', fontWeight:'500' }}>
                {shift.staffName}
              </td>

              <td>
                <span style={{
                  background:'#edf2f7',
                  padding:'4px 8px',
                  borderRadius:'4px',
                  fontSize:'0.85rem'
                }}>
                  {shift.role}
                </span>
              </td>

              <td>
                {shift.checkedIn ? '🟢 On-site' : '⚪ Off-site'}
              </td>

              <td>

                <button
                  onClick={()=>updateShift({
                    ...shift,
                    checkedIn: !shift.checkedIn
                  })}
                  style={{
                    cursor:'pointer',
                    padding:'6px 12px',
                    borderRadius:'4px',
                    border:'none',
                    background: shift.checkedIn ? '#fff5f5':'#f0fff4',
                    color: shift.checkedIn ? '#c53030':'#2f855a'
                  }}
                >

                  {shift.checkedIn ? 'Sign Out' : 'Sign In'}

                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </section>

  );

};

export default ShiftManager;