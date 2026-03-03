import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { fetchInitialData } from "../service/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [beds, setBeds] = useState([]);

  // 1. Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const { shiftsData, bedsData } = await fetchInitialData();
        setShifts(shiftsData);
        setBeds(bedsData);
      } catch (error) {
        console.error("Failed to load clinical data", error);
      }
    };
    loadData();
  }, []);

  // 2. DERIVED ALERTS (Calculated on the fly)
  // This replaces the useEffect + setAlerts logic entirely.
  const alerts = useMemo(() => {
    const activeAlerts = [];
    if (beds.length === 0) return activeAlerts;

    const occupiedCount = beds.filter(b => b.status === "occupied").length;
    const occupancyRatio = occupiedCount / beds.length;

    if (occupancyRatio >= 0.8) {
      activeAlerts.push({
        id: "occupancy-warning",
        type: "warning",
        message: `⚠ Ward Occupancy ≥ 80% (${Math.round(occupancyRatio * 100)}%)`,
      });
    }

    return activeAlerts;
  }, [beds]); 

  // 3. Update Logics (Memoized for performance)
  const updateBed = useCallback((updatedBed) => {
    setBeds(prev => prev.map(b => b.id === updatedBed.id ? { ...b, ...updatedBed } : b));
  }, []);

  const updateShift = useCallback((updatedShift) => {
    setShifts(prev => prev.map(s => s.id === updatedShift.id ? { ...s, ...updatedShift } : s));
  }, []);

  const value = useMemo(() => ({
    shifts,
    beds,
    alerts, // Still passed to the context, but now it's always "fresh"
    updateBed,
    updateShift
  }), [shifts, beds, alerts, updateBed, updateShift]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};