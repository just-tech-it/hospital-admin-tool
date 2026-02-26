import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { fetchInitialData } from "../service/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [beds, setBeds] = useState([]);
  const [alerts, setAlerts] = useState([]);

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

  // 2. Alert logic for occupancy warning
  useEffect(() => {
    if (beds.length === 0) return;

    const ALERT_ID = "occupancy-warning";
    const occupiedCount = beds.filter(b => b.status === "occupied").length;
    const occupancyRatio = occupiedCount / beds.length;
    const shouldShowWarning = occupancyRatio >= 0.8;

    console.log(`Checking Alert: Ratio is ${occupancyRatio.toFixed(2)}. Show warning? ${shouldShowWarning}`);

    setAlerts(prevAlerts => {
      // Always remove the old alert first to avoid duplicates
      const otherAlerts = prevAlerts.filter(a => a.id !== ALERT_ID);

      if (shouldShowWarning) {
        return [
          ...otherAlerts,
          {
            id: ALERT_ID,
            type: "warning",
            message: `⚠ Ward Occupancy ≥ 80% (${Math.round(occupancyRatio * 100)}%)`,
          }
        ];
      }
      
      // If ratio is < 80%, we return the list WITHOUT the occupancy warning
      return otherAlerts;
    });
  }, [beds]); // Correctly re-runs whenever beds state changes

  // 3. Bed Update Logic
  const updateBed = useCallback((updatedBed) => {
    setBeds((prevBeds) =>
      prevBeds.map((b) =>
        b.id === updatedBed.id ? { ...b, ...updatedBed } : b
      )
    );
  }, []);

  // 4. Shift Update Logic
  const updateShift = useCallback((updatedShift) => {
    setShifts((prev) =>
      prev.map((s) =>
        s.id === updatedShift.id ? { ...s, ...updatedShift } : s
      )
    );
  }, []);

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