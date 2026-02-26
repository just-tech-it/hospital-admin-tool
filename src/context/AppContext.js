import { createContext, useState, useEffect, useMemo, useCallback } from "react";
// 1. Import your API service
import { fetchInitialData } from "../service/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [beds, setBeds] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Load initial data once
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

  // Alert logic for occupancy warning
  
  // Replace your existing occupancy useEffect with this:

 useEffect(() => {
  const ALERT_ID = "occupancy-warning";
  
  // Calculate first
  const total = beds.length;
  const occupiedCount = beds.filter(b => b.status === "occupied").length;
  const occupancyRatio = total > 0 ? occupiedCount / total : 0;

  setAlerts(prevAlerts => {
    // 1. Always remove the old warning first
    const filtered = prevAlerts.filter(a => a.id !== ALERT_ID);

    // 2. Only add it back if the math is actually >= 80%
    if (total > 0 && occupancyRatio >= 0.8) {
      return [
        ...filtered,
        {
          id: ALERT_ID,
          type: "warning",
          message: `⚠ Ward Occupancy ≥ 80% (${Math.round(occupancyRatio * 100)}%)`,
        }
      ];
    }
    // 3. Otherwise, return the filtered list (warning is gone)
    return filtered;
  });
}, [beds]);


  // Correct updateBed: creates new array and new bed objects to force React update
  const updateBed = useCallback((updatedBed) => {
    setBeds((prevBeds) =>
      prevBeds.map((b) =>
        (b.id === updatedBed.id ? { ...b, ...updatedBed } : b))
    );
  }, []);

  // Update shift (same pattern)
  const updateShift = useCallback((updatedShift) => {
    setShifts((prev) =>
      prev.map((s) => 
        (s.id === updatedShift.id ? {...s, ...updatedShift} : s))
    );
  }, []);

  // Memoize context value for performance
  const value = useMemo(() => ({
    shifts,
    beds,
    alerts,
    updateBed,
    updateShift
  }), [shifts, beds, alerts, updateBed, updateShift]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};