import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { fetchInitialData } from "../service/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const { shiftsData, bedsData } = await fetchInitialData();
        setShifts(shiftsData);
        setBeds(bedsData);
      } catch (error) {
        console.error("Failed to load clinical data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Centralized Stats Logic (The "Brain" of the App)
  const stats = useMemo(() => {
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(
      (bed) => bed.status?.toLowerCase().trim() === "occupied"
    ).length;
    
    const occupancyRatio = totalBeds > 0 ? occupiedBeds / totalBeds : 0;

    return {
      totalBeds,
      occupiedBeds,
      occupancyRatio,
      availableBeds: totalBeds - occupiedBeds,
    };
  }, [beds]);

  // 3. Derived Alerts (Consumes the centralized stats)
  const alerts = useMemo(() => {
    const activeAlerts = [];

    if (stats.occupancyRatio >= 0.8) {
      activeAlerts.push({
        id: "occupancy-warning",
        type: "warning",
        message: `⚠ Ward Occupancy High: ${Math.round(stats.occupancyRatio * 100)}%`,
      });
    }

    // Add more global logic here (e.g., staff-to-patient ratio alerts)
    return activeAlerts;
  }, [stats]);

  // 4. Update helpers
  const updateBed = useCallback((updatedBed) => {
    setBeds((prevBeds) =>
      prevBeds.map((bed) =>
        bed.id === updatedBed.id ? { ...bed, ...updatedBed } : bed
      )
    );
  }, []);

  const updateShift = useCallback((updatedShift) => {
    setShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift.id === updatedShift.id ? { ...shift, ...updatedShift } : shift
      )
    );
  }, []);

  // 5. Context Value
  const value = useMemo(() => ({
    shifts,
    beds,
    stats, // Shared statistics
    alerts, // Shared alerts
    loading,
    updateBed,
    updateShift,
  }), [shifts, beds, stats, alerts, loading, updateBed, updateShift]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};