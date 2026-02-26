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

  // 1. Calculate occupancy
  const totalBeds = beds.length;
  const occupiedCount = beds.filter((b) => b.status === "occupied").length;
  const occupancyPercent = totalBeds > 0 ? (occupiedCount / totalBeds) * 100 : 0;

  setAlerts((prevAlerts) => {
    // 2. Filter out the existing warning every time the effect runs
    const otherAlerts = prevAlerts.filter(a => a.id !== ALERT_ID);

    // 3. Only add it back if we actually meet the criteria
    if (totalBeds > 0 && occupancyPercent >= 80) {
      return [
        ...otherAlerts,
        {
          id: ALERT_ID,
          message: `⚠ Ward Occupancy ≥ 80% (${Math.round(occupancyPercent)}%)`,
          type: "warning"
        }
      ];
    }

    // 4. Otherwise, return the list WITHOUT the warning
    return otherAlerts;
  });
}, [beds]);
  


  // Correct updateBed: creates new array and new bed objects to force React update
  const updateBed = useCallback((updatedBed) => {
    setBeds((prevBeds) =>
      prevBeds.map((b) =>
        b.id === updatedBed.id ? { ...b, status: updatedBed.status } : b
      )
    );
  }, []);

  // Update shift (same pattern)
  const updateShift = useCallback((updatedShift) => {
    setShifts((prev) =>
      prev.map((s) => (s.id === updatedShift.id ? updatedShift : s))
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