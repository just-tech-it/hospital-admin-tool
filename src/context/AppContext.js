import React, { createContext, useReducer, useEffect, useMemo, useCallback } from "react";
import { fetchInitialData } from "../service/api";

export const AppContext = createContext();

const initialState = {
  beds: [],
  shifts: [],
  loading: true,
  logs: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        beds: action.beds,
        shifts: action.shifts,
        loading: false
      };

    case "UPDATE_BED":
      return {
        ...state,
        beds: state.beds.map(b =>
          b.id === action.bed.id ? { ...b, ...action.bed } : b
        )
      };

    case "UPDATE_SHIFT":
      return {
        ...state,
        shifts: state.shifts.map(s =>
          s.id === action.shift.id ? { ...s, ...action.shift } : s
        )
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

export const AppProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Initial Data Load + LocalStorage check
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedBeds = localStorage.getItem("hosp_beds");
        const savedShifts = localStorage.getItem("hosp_shifts");

        if (savedBeds && savedShifts) {
          dispatch({
            type: "SET_DATA",
            beds: JSON.parse(savedBeds),
            shifts: JSON.parse(savedShifts)
          });
        } else {
          const { shiftsData, bedsData } = await fetchInitialData();
          dispatch({ type: "SET_DATA", beds: bedsData, shifts: shiftsData });
        }
      } catch (error) {
        console.error("Failed to load clinical data", error);
        dispatch({ type: "SET_DATA", beds: [], shifts: [] });
      }
    };

    loadData();
  }, []);

  // Persist to localStorage when beds or shifts update
  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem("hosp_beds", JSON.stringify(state.beds));
      localStorage.setItem("hosp_shifts", JSON.stringify(state.shifts));
    }
  }, [state.beds, state.shifts, state.loading]);

  // Real-time simulation of updates every 10 seconds
  useEffect(() => {
    if (state.loading) return;

    const interval = setInterval(() => {
      // Randomly toggle a bed status
      dispatch({
        type: "UPDATE_BED",
        bed: (() => {
          const index = Math.floor(Math.random() * state.beds.length);
          const bed = state.beds[index];
          const newStatus = bed.status === "occupied" ? "available" : "occupied";
          return {
            ...bed,
            status: newStatus,
            patient:
              newStatus === "available" ? null : bed.patient || { name: "Auto-Assigned" }
          };
        })()
      });

      // Randomly toggle a staff checkedIn status
      dispatch({
        type: "UPDATE_SHIFT",
        shift: (() => {
          const index = Math.floor(Math.random() * state.shifts.length);
          const shift = state.shifts[index];
          return { ...shift, checkedIn: !shift.checkedIn };
        })()
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [state.beds, state.shifts, state.loading]);

  // Add log helper
  const addLog = useCallback((action, message) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      action,
      message
    };
    dispatch({ type: "ADD_LOG", log: newLog });
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const totalBeds = state.beds.length;
    const occupiedBeds = state.beds.filter(b => b.status?.toLowerCase() === "occupied").length;
    const activeStaff = state.shifts.filter(s => s.checkedIn).length;

    const occupancyRatio = totalBeds > 0 ? occupiedBeds / totalBeds : 0;
    const staffToPatientRatio = occupiedBeds > 0 ? (activeStaff / occupiedBeds).toFixed(2) : activeStaff;

    return {
      totalBeds,
      occupiedBeds,
      occupancyRatio,
      availableBeds: totalBeds - occupiedBeds,
      activeStaff,
      staffToPatientRatio
    };
  }, [state.beds, state.shifts]);

  // Alerts
  const alerts = useMemo(() => {
    const activeAlerts = [];

    if (stats.occupancyRatio >= 0.8) {
      activeAlerts.push({
        id: "occupancy-warning",
        type: "warning",
        message: `⚠ Ward Occupancy High: ${Math.round(stats.occupancyRatio * 100)}%`
      });
    }

    if (stats.occupiedBeds > 0 && stats.staffToPatientRatio < 0.2) {
      activeAlerts.push({
        id: "staffing-alert",
        type: "danger",
        message: `Critically Low Staffing: Ratio is ${stats.staffToPatientRatio} staff per patient`
      });
    }

    return activeAlerts;
  }, [stats]);

  // Update bed helper (with logging)
  const updateBed = useCallback(
    updatedBed => {
      dispatch({ type: "UPDATE_BED", bed: updatedBed });
      addLog("BED_MGMT", `Bed ${updatedBed.id} marked as ${updatedBed.status.toUpperCase()}`);
    },
    [addLog]
  );

  // Update shift helper (with logging)
  const updateShift = useCallback(
    updatedShift => {
      dispatch({ type: "UPDATE_SHIFT", shift: updatedShift });
      const statusText = updatedShift.checkedIn ? "Checked In" : "Checked Out";
      addLog("STAFF_MGMT", `${updatedShift.staffName} (${updatedShift.role}) ${statusText}`);
    },
    [addLog]
  );

  const value = useMemo(
    () => ({
      ...state,
      stats,
      alerts,
      updateBed,
      updateShift,
      addLog
    }),
    [state, stats, alerts, updateBed, updateShift, addLog]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};