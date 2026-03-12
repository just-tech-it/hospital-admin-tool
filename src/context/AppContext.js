import React, { createContext, useState, useEffect } from 'react';
import { fetchInitialData } from '../services/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [beds, setBeds] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    occupiedBeds: 0,
    availableBeds: 0,
    activeStaff: 0,
    staffToPatientRatio: 0
  });

  // Calculate stats dynamically
  const calculateStats = (bedsData, shiftsData) => {
    const occupiedBeds = bedsData.filter(b => b.status === 'occupied').length;
    const availableBeds = bedsData.filter(b => b.status === 'available').length;
    const activeStaff = shiftsData.filter(s => s.checkedIn).length;
    const staffToPatientRatio = occupiedBeds > 0 ? +(activeStaff / occupiedBeds).toFixed(2) : 0;
    return { occupiedBeds, availableBeds, activeStaff, staffToPatientRatio };
  };

  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const { bedsData, shiftsData } = await fetchInitialData();
        setBeds(bedsData);
        setShifts(shiftsData);
        setStats(calculateStats(bedsData, shiftsData));
      } catch (error) {
        console.error("Failed to load initial data", error);
      }
    };
    loadData();
  }, []);

  // Bed update function
  const updateBed = (updatedBed) => {
    const newBeds = beds.map(b => b.id === updatedBed.id ? updatedBed : b);
    setBeds(newBeds);
    setStats(calculateStats(newBeds, shifts));
    setLogs(prev => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), message: `Bed ${updatedBed.id} updated` }, ...prev].slice(0,10));
  };

  // Shift update function
  const updateShift = (updatedShift) => {
    const newShifts = shifts.map(s => s.id === updatedShift.id ? updatedShift : s);
    setShifts(newShifts);
    setStats(calculateStats(beds, newShifts));
    setLogs(prev => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), message: `${updatedShift.staffName} status changed` }, ...prev].slice(0,10));
  };

  // Demo: Real-time updates every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      if (beds.length === 0) return;
      const randomBed = beds[Math.floor(Math.random()*beds.length)];
      if(randomBed) {
        updateBed({
          ...randomBed,
          status: randomBed.status === 'occupied' ? 'available' : 'occupied',
          patient: randomBed.status === 'occupied' ? null : { name: 'Random Patient', condition: 'Observation' }
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [beds]);

  return (
    <AppContext.Provider value={{ beds, shifts, updateBed, updateShift, stats, logs }}>
      {children}
    </AppContext.Provider>
  );
};