import { createContext, useState, useEffect, useMemo, useCallback } from "react";
import { fetchInitialData } from "../service/api";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [shifts, setShifts] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  // 1. Initial Data Load with Persistence Check
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from localStorage first for "instant" feel
        const savedBeds = localStorage.getItem("hosp_beds");
        const savedShifts = localStorage.getItem("hosp_shifts");

        if (savedBeds && savedShifts) {
          setBeds(JSON.parse(savedBeds));
          setShifts(JSON.parse(savedShifts));
        } else {
          // If no local data, fetch from API
          const { shiftsData, bedsData } = await fetchInitialData();
          setShifts(shiftsData);
          setBeds(bedsData);
        }
      } catch (error) {
        console.error("Failed to load clinical data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 2. Persistence Effect: Save to localStorage whenever data changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("hosp_beds", JSON.stringify(beds));
      localStorage.setItem("hosp_shifts", JSON.stringify(shifts));
    }
  }, [beds, shifts, loading]);

  // 3. Activity Logger Helper
  const addLog = useCallback((action, message) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      action,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 10)); // Keep last 10 entries
  }, []);

  // 4. Centralized Stats (The Dashboard "Brain")
  const stats = useMemo(() => {
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(b => b.status?.toLowerCase().trim() === "occupied").length;
    const activeStaff = shifts.filter(s => s.checkedIn).length;
    
    const occupancyRatio = totalBeds > 0 ? occupiedBeds / totalBeds : 0;
    
    // Pro Metric: Staff to Patient Ratio
    const staffToPatientRatio = occupiedBeds > 0 ? (activeStaff / occupiedBeds).toFixed(2) : activeStaff;

    return {
      totalBeds,
      occupiedBeds,
      occupancyRatio,
      availableBeds: totalBeds - occupiedBeds,
      activeStaff,
      staffToPatientRatio
    };
  }, [beds, shifts]);

  // 5. Advanced Alerts
  const alerts = useMemo(() => {
    const activeAlerts = [];

    // Occupancy Warning
    if (stats.occupancyRatio >= 0.8) {
      activeAlerts.push({
        id: "occupancy-warning",
        type: "warning",
        message: `⚠ Ward Occupancy High: ${Math.round(stats.occupancyRatio * 100)}%`,
      });
    }

    // Staffing Level Warning
    if (stats.occupiedBeds > 0 && stats.staffToPatientRatio < 0.2) {
      activeAlerts.push({
        id: "staffing-alert",
        type: "danger",
        message: `Critically Low Staffing: Ratio is ${stats.staffToPatientRatio} staff per patient`,
      });
    }

    return activeAlerts;
  }, [stats]);

  // 6. Upgraded Update Helpers with Logging
  const updateBed = useCallback((updatedBed) => {
    setBeds((prevBeds) =>
      prevBeds.map((bed) =>
        bed.id === updatedBed.id ? { ...bed, ...updatedBed } : bed
      )
    );
    addLog("BED_MGMT", `Bed ${updatedBed.id} marked as ${updatedBed.status.toUpperCase()}`);
  }, [addLog]);

  const updateShift = useCallback((updatedShift) => {
    setShifts((prevShifts) =>
      prevShifts.map((shift) =>
        shift.id === updatedShift.id ? { ...shift, ...updatedShift } : shift
      )
    );
    const statusText = updatedShift.checkedIn ? "Checked In" : "Checked Out";
    addLog("STAFF_MGMT", `${updatedShift.staffName} (${updatedShift.role}) ${statusText}`);
  }, [addLog]);

  // 7. Context Value
  const value = useMemo(() => ({
    shifts,
    beds,
    stats,
    alerts,
    logs, // Provide logs to ActivityLog component
    loading,
    updateBed,
    updateShift,
    addLog
  }), [shifts, beds, stats, alerts, logs, loading, updateBed, updateShift, addLog]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};