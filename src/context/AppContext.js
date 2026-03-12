import React, { createContext, useReducer, useEffect } from 'react';
import { fetchInitialData } from '../api'; // your API helper

export const AppContext = createContext();

const initialState = {
  beds: [],
  shifts: [],
  logs: [],
  stats: {
    occupiedBeds: 0,
    availableBeds: 0,
    activeStaff: 0,
    staffToPatientRatio: 0
  }
};

function reducer(state, action) {
  switch(action.type) {
    case "SET_DATA":
      return {
        ...state,
        beds: action.beds,
        shifts: action.shifts,
        logs: [],
        stats: calculateStats(action.beds, action.shifts),
      };

    case "UPDATE_BED":
      const updatedBeds = state.beds.map(b => b.id === action.bed.id ? { ...b, ...action.bed } : b);
      return {
        ...state,
        beds: updatedBeds,
        stats: calculateStats(updatedBeds, state.shifts),
        logs: [{ id: Date.now(), timestamp: new Date().toLocaleString(), message: `Bed ${action.bed.id} updated.` }, ...state.logs].slice(0,10)
      };

    case "UPDATE_SHIFT":
      const updatedShifts = state.shifts.map(s => s.id === action.shift.id ? { ...s, ...action.shift } : s);
      return {
        ...state,
        shifts: updatedShifts,
        stats: calculateStats(state.beds, updatedShifts),
        logs: [{ id: Date.now(), timestamp: new Date().toLocaleString(), message: `Shift for ${action.shift.staffName} updated.` }, ...state.logs].slice(0,10)
      };

    case "ADD_LOG":
      return {
        ...state,
        logs: [action.log, ...state.logs].slice(0,10)
      };

    default:
      return state;
  }
}

function calculateStats(beds, shifts) {
  const occupiedBeds = beds.filter(b => b.status === 'occupied').length;
  const availableBeds = beds.length - occupiedBeds;
  const activeStaff = shifts.filter(s => s.checkedIn).length;
  const staffToPatientRatio = occupiedBeds ? (activeStaff / occupiedBeds).toFixed(2) : 0;

  return { occupiedBeds, availableBeds, activeStaff, staffToPatientRatio };
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchInitialData().then(({ bedsData, shiftsData }) => {
      dispatch({ type: "SET_DATA", beds: bedsData, shifts: shiftsData });
    });
  }, []);

  // Simulate random updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (state.beds.length === 0 || state.shifts.length === 0) return;

      // Randomly toggle a bed's status
      const randomBed = state.beds[Math.floor(Math.random() * state.beds.length)];
      const newStatus = randomBed.status === 'occupied' ? 'available' : 'occupied';

      dispatch({
        type: 'UPDATE_BED',
        bed: { ...randomBed, status: newStatus, patient: newStatus === 'occupied' ? { name: 'Auto Patient', condition: 'Auto' } : null }
      });

      // Randomly toggle a shift's checkedIn status
      const randomShift = state.shifts[Math.floor(Math.random() * state.shifts.length)];
      dispatch({
        type: 'UPDATE_SHIFT',
        shift: { ...randomShift, checkedIn: !randomShift.checkedIn }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [state.beds, state.shifts]);

  // Action helpers for components
  const updateBed = (bed) => dispatch({ type: 'UPDATE_BED', bed });
  const updateShift = (shift) => dispatch({ type: 'UPDATE_SHIFT', shift });
  const addLog = (log) => dispatch({ type: 'ADD_LOG', log });

  const value = {
    ...state,
    updateBed,
    updateShift,
    addLog
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};