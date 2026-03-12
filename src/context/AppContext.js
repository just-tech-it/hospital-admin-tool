import React, { createContext, useReducer, useEffect } from "react";
import { fetchInitialData } from "../services/api";

export const AppContext = createContext();

const initialState = {
  beds: [],
  shifts: [],
  logs: [],
  stats: {
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    activeStaff: 0,
    staffToPatientRatio: 0
  },
  loading: true
};

function reducer(state, action) {
  switch(action.type) {
    case "SET_DATA":
      return {
        ...state,
        beds: action.beds,
        shifts: action.shifts,
        stats: calculateStats(action.beds, action.shifts),
        loading: false
      };
    case "UPDATE_BED":
      const updatedBeds = state.beds.map(b =>
        b.id === action.bed.id ? { ...b, ...action.bed } : b
      );
      return {
        ...state,
        beds: updatedBeds,
        stats: calculateStats(updatedBeds, state.shifts),
        logs: [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), message: `Bed ${action.bed.id} updated.` }, ...state.logs].slice(0, 10)
      };
    case "UPDATE_SHIFT":
      const updatedShifts = state.shifts.map(s =>
        s.id === action.shift.id ? { ...s, ...action.shift } : s
      );
      return {
        ...state,
        shifts: updatedShifts,
        stats: calculateStats(state.beds, updatedShifts),
        logs: [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), message: `Shift for ${action.shift.staffName} updated.` }, ...state.logs].slice(0, 10)
      };
    case "ADD_LOG":
      return {
        ...state,
        logs: [action.log, ...state.logs].slice(0, 10)
      };
    default:
      return state;
  }
}

// Stats calculator
function calculateStats(beds, shifts) {
  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(b => b.status === "occupied").length;
  const availableBeds = totalBeds - occupiedBeds;
  const activeStaff = shifts.filter(s => s.checkedIn).length;
  const staffToPatientRatio = occupiedBeds > 0 ? +(activeStaff / occupiedBeds).toFixed(2) : 0;

  return { totalBeds, occupiedBeds, availableBeds, activeStaff, staffToPatientRatio };
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchInitialData().then(({ bedsData, shiftsData }) => {
      dispatch({ type: "SET_DATA", beds: bedsData, shifts: shiftsData });
    });
  }, []);

  // Bed actions
  const updateBed = (bed) => dispatch({ type: "UPDATE_BED", bed });
  const updateShift = (shift) => dispatch({ type: "UPDATE_SHIFT", shift });

  return (
    <AppContext.Provider value={{ ...state, updateBed, updateShift }}>
      {children}
    </AppContext.Provider>
  );
};