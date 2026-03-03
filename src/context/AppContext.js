import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { fetchInitialData } from "../service/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [beds, setBeds] = useState([]);

  // Load initial data
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

  // Derived Alerts (always recalculates when beds change)
  const alerts = useMemo(() => {
    if (!beds.length) return [];

    const occupiedCount = beds.filter(
      bed => bed.status?.toLowerCase().trim() === "occupied"
    ).length;

    const occupancy = occupiedCount / beds.length;

    if (occupancy < 0.8) return [];

    return [
      {
        id: "occupancy-warning",
        type: "warning",
        message: `⚠ Ward Occupancy ≥ 80% (${Math.round(occupancy * 100)}%)`,
      },
    ];
  }, [beds]);

  // Update helpers
  const updateBed = useCallback((updatedBed) => {
    setBeds(prevBeds =>
      prevBeds.map(bed =>
        bed.id === updatedBed.id ? { ...bed, ...updatedBed } : bed
      )
    );
  }, []);

  const updateShift = useCallback((updatedShift) => {
    setShifts(prevShifts =>
      prevShifts.map(shift =>
        shift.id === updatedShift.id ? { ...shift, ...updatedShift } : shift
      )
    );
  }, []);

  const value = {
    shifts,
    beds,
    alerts,
    updateBed,
    updateShift,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};