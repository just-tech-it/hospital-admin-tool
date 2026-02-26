import { createContext, useState, useEffect, useMemo, useCallback } from "react";
// 1. Import the service you just created
import { fetchInitialData } from "../service/api"; 


export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [beds, setBeds] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // 2. Simplified useEffect using the API service
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

  // 3. Keep your alert logic exactly as it was
  useEffect(() => {
    if (beds.length === 0) return;

    const occupiedCount = beds.filter((b) => b.status === "occupied").length;
    const occupancyRate = occupiedCount / beds.length;
    const ALERT_ID = "occupancy-warning";

    const isOverCapacity = occupancyRate >= 0.8; 

    setAlerts((prevAlerts) => {
      const otherAlerts = prevAlerts.filter(a => a.id !== ALERT_ID);

      if (isOverCapacity) {
        return [
          ...otherAlerts,
          {
            id: ALERT_ID,
            message: `⚠ Ward Occupancy ≥ 80% (${(occupancyRate * 100).toFixed(0)}%)`,
            type: "warning"
          }
        ];
      }

      return otherAlerts;
    });
  }, [beds]);


  // 4. Keep your helper functions
  const updateShift = useCallback((updatedShift) => {
    setShifts((prev) => prev.map((s) => (s.id === updatedShift.id ? updatedShift : s)));
  }, []);

  const updateBed = useCallback((updatedBed) => {
    setBeds((prev) => prev.map((b) => (b.id === updatedBed.id ? updatedBed : b)));
  }, []);

  const value = useMemo(() => ({
    shifts, beds, alerts, updateBed, updateShift 
  }), [shifts, beds, alerts, updateBed, updateShift]);

  return (
    // 5. IMPORTANT: Use AppContext.Provider (not AppProvider)
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};