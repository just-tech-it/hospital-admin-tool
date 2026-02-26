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
  if (beds.length === 0) {
    setAlerts([]);
    return;
  }

  const occupiedCount = beds.filter(b => b.status === "occupied").length;
  const occupancyRatio = occupiedCount / beds.length;
  const ALERT_ID = "occupancy-warning";

  console.log("Beds length:", beds.length);
  console.log("Occupied count:", occupiedCount);
  console.log("Occupancy ratio:", occupancyRatio);

  setAlerts(prevAlerts => {
    const filteredAlerts = prevAlerts.filter(a => a.id !== ALERT_ID);

    if (occupancyRatio >= 0.8) {
      console.log("Adding warning alert");
      return [
        ...filteredAlerts,
        {
          id: ALERT_ID,
          type: "warning",
          message: `⚠ Ward Occupancy ≥ 80% (${Math.round(occupancyRatio * 100)}%)`,
        }
      ];
    } else {
      console.log("Removing warning alert");
      return filteredAlerts;
    }
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