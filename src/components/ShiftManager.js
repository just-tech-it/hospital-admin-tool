import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const ShiftManager = () => {
  const { shifts, updateShift } = useContext(AppContext);

  const handleCheckIn = (shift) => {
    updateShift({ ...shift, checkedIn: !shift.checkedIn });
  };

  return (
    <section style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', marginTop: '1rem' }}>
      <h2>Staff Shifts</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
            <th>Staff Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map(shift => (
            <tr key={shift.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{shift.staffName}</td>
              <td>{shift.role}</td>
              <td>{shift.checkedIn ? '✅ On-site' : '⭕ Off-site'}</td>
              <td>
                <button onClick={() => handleCheckIn(shift)}>
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