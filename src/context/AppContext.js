import { createContext, useState, useEffect, useMemo, useCallback } from "react";
// 1. Import the service you just created
import { fetchInitialData } from "../service/api"; 
import { type } from "@testing-library/user-event/dist/type";

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

  const occupied = beds.filter((b) => b.status === "occupied").length;
  const isOverCapacity = (occupied / beds.length) > 0.8;

  if (isOverCapacity) {
    // Only set the alert if we don't already have one showing
    // This prevents the "flashing" or constant timer resets
    const newAlert = { 
      id: Date.now(), 
      message: "⚠ Ward Occupancy > 80%", 
      type: "warning" // Matches .alert-warning
    };
    setAlerts([newAlert]);

    const timer = setTimeout(() => setAlerts([]), 3000);
    return () => clearTimeout(timer);
  } else {
    // ONLY clear if there's actually an alert to clear
    // This stops unnecessary re-renders
    if (alerts.length > 0) {
      setAlerts([]);
    }
  }
}, [beds]); // Remove 'alerts' from here to avoid loops

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