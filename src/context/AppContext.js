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
  useEffect(() => {
    if (beds.length === 0) return;

    const occupiedCount = beds.filter((b) => b.status === "occupied").length;
    const occupancyPercent = (occupiedCount / beds.length) * 100;
    const ALERT_ID = "occupancy-warning";

    console.log("Beds:", beds.length, "Occupied:", occupiedCount, "Occupancy %:", occupancyPercent);

    setAlerts((prevAlerts) => {
      const otherAlerts = prevAlerts.filter(a => a.id !== ALERT_ID);

      if (occupiedCount >= beds.length * 0.8) {
        console.log("Showing warning alert");
        return [
          ...otherAlerts,
          {
            id: ALERT_ID,
            message: `⚠ Ward Occupancy ≥ 80% (${Math.round(occupancyPercent)}%)`,
            type: "warning"
          }
        ];
      }

      console.log("Clearing warning alert");
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