import { createContext, useState, useEffect, useMemo } from "react";
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

    const occupied = beds.filter((b) => b.status === "occupied").length;

    if (occupied / beds.length > 0.8) {
      const newAlert = { id: Date.now(), message: "⚠ Ward Occupancy > 80% " };
      setAlerts([newAlert]);

      const timer = setTimeout(() => setAlerts([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [beds]);

  // 4. Keep your helper functions
  const updateShift = (updatedShift) => {
    setShifts((prev) => prev.map((s) => (s.id === updatedShift.id ? updatedShift : s)));
  };

  const updateBed = (updatedBed) => {
    setBeds((prev) => prev.map((b) => (b.id === updatedBed.id ? updatedBed : b)));
  };

  const value = useMemo(() => {
    return { shifts, beds, alerts, updateBed, updateShift };
  }, [shifts, beds, alerts]);

  return (
    // 5. IMPORTANT: Use AppContext.Provider (not AppProvider)
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};