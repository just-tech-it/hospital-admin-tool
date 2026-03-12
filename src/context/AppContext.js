import { createContext, useEffect, useMemo, useCallback, useReducer } from "react";
import { fetchInitialData } from "../service/api";

export const AppContext = createContext();

// Initial State
const initialState = {
  beds: [],
  shifts: [],
  logs: [],
  loading: true
};

// Reducer
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

      case "ASSIGN_PATIENT":
  return {
    ...state,
    beds: state.beds.map(b =>
      b.id === action.bedId
        ? { ...b, status: "occupied", patient: action.patient }
        : b
    )
  };

case "DISCHARGE_PATIENT":
  return {
    ...state,
    beds: state.beds.map(b =>
      b.id === action.bedId
        ? { ...b, status: "available", patient: null }
        : b
    )
  };

    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {

  const [state, dispatch] = useReducer(reducer, initialState);
  const { beds, shifts, logs, loading } = state;

  const assignPatient = useCallback((bedId, patient) => {

  dispatch({
    type: "ASSIGN_PATIENT",
    bedId,
    patient
  });

  addLog("PATIENT", `${patient.name} assigned to Bed ${bedId}`);

}, [addLog]);

const dischargePatient = useCallback((bedId) => {

  dispatch({
    type: "DISCHARGE_PATIENT",
    bedId
  });

  addLog("PATIENT", `Patient discharged from Bed ${bedId}`);

}, [addLog]);

  // 1. Initial Data Load
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

          dispatch({
            type: "SET_DATA",
            beds: bedsData,
            shifts: shiftsData
          });

        }

      } catch (error) {
        console.error("Failed to load clinical data", error);
      }
    };

    loadData();

  }, []);

  useEffect(() => {

  const interval = setInterval(() => {

    const randomEvent = Math.random();

    if (randomEvent > 0.7) {
      addLog("SYSTEM", "Routine ward check completed");
    }

  }, 8000);

  return () => clearInterval(interval);

}, [addLog]);

  // 2. Persist Data
  useEffect(() => {

    if (!loading) {

      localStorage.setItem("hosp_beds", JSON.stringify(beds));
      localStorage.setItem("hosp_shifts", JSON.stringify(shifts));

    }

  }, [beds, shifts, loading]);

  // 3. Activity Logger
  const addLog = useCallback((action, message) => {

    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }),
      action,
      message
    };

    dispatch({
      type: "ADD_LOG",
      log: newLog
    });

  }, []);

  // 4. Dashboard Stats
  const stats = useMemo(() => {

    const totalBeds = beds.length;

    const occupiedBeds =
      beds.filter(b => b.status?.toLowerCase().trim() === "occupied").length;

    const activeStaff =
      shifts.filter(s => s.checkedIn).length;

    const occupancyRatio =
      totalBeds > 0 ? occupiedBeds / totalBeds : 0;

    const staffToPatientRatio =
      occupiedBeds > 0
        ? Number((activeStaff / occupiedBeds).toFixed(2))
        : activeStaff;

    return {
      totalBeds,
      occupiedBeds,
      occupancyRatio,
      availableBeds: totalBeds - occupiedBeds,
      activeStaff,
      staffToPatientRatio
    };

  }, [beds, shifts]);

  // 5. Alerts
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

  // 6. Update Bed
  const updateBed = useCallback((updatedBed) => {

    dispatch({
      type: "UPDATE_BED",
      bed: updatedBed
    });

    addLog(
      "BED_MGMT",
      `Bed ${updatedBed.id} marked as ${updatedBed.status.toUpperCase()}`
    );

  }, [addLog]);

  // 7. Update Shift
  const updateShift = useCallback((updatedShift) => {

    dispatch({
      type: "UPDATE_SHIFT",
      shift: updatedShift
    });

    const statusText =
      updatedShift.checkedIn ? "Checked In" : "Checked Out";

    addLog(
      "STAFF_MGMT",
      `${updatedShift.staffName} (${updatedShift.role}) ${statusText}`
    );

  }, [addLog]);

  // 8. Context Value
  const value = useMemo(() => ({
    beds,
    shifts,
    stats,
    alerts,
    logs,
    loading,
    updateBed,
    updateShift,
    addLog
  }), [beds, shifts, stats, alerts, logs, loading, updateBed, updateShift, addLog]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );

};