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
    const occupied = bedsData.filter(b => b.status === 'occupied').length;
    const available = bedsData.filter(b => b.status === 'available').length;
    const active = shiftsData.filter(s => s.checkedIn).length;
    const ratio = occupied > 0 ? +(active / occupied).toFixed(2) : 0;
    
    // We add these extra keys so the Header and Charts can read them
    return { 
      occupiedBeds: occupied, 
      availableBeds: available, 
      activeStaff: active, 
      staffToPatientRatio: ratio,
      totalBeds: bedsData.length,
      occupancyRatio: bedsData.length > 0 ? occupied / bedsData.length : 0
    };
  };

  // Fetch initial data - THIS LOADS YOUR JSON FILES
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

  const updateBed = (updatedBed) => {
    setBeds(prevBeds => {
      const newBeds = prevBeds.map(b => b.id === updatedBed.id ? updatedBed : b);
      setStats(calculateStats(newBeds, shifts));
      return newBeds;
    });
    setLogs(prev => [{ 
      id: Date.now(), 
      timestamp: new Date().toLocaleTimeString(), 
      message: `Bed ${updatedBed.id}: ${updatedBed.status === 'occupied' ? 'Admitted Patient' : 'Discharged'}` 
    }, ...prev].slice(0, 10));
  };

  const updateShift = (updatedShift) => {
    setShifts(prevShifts => {
      const newShifts = prevShifts.map(s => s.id === updatedShift.id ? updatedShift : s);
      setStats(calculateStats(beds, newShifts));
      return newShifts;
    });
    setLogs(prev => [{ 
      id: Date.now(), 
      timestamp: new Date().toLocaleTimeString(), 
      message: `${updatedShift.staffName} is now ${updatedShift.checkedIn ? 'On-site' : 'Off-site'}` 
    }, ...prev].slice(0, 10));
  };

  // Demo: Real-time updates ONLY if we have data
  useEffect(() => {
    if (beds.length === 0) return; // Wait until data is loaded!

    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * beds.length);
      const randomBed = beds[randomIdx];
      
      if (randomBed) {
        const isOccupied = randomBed.status === 'occupied';
        updateBed({
          ...randomBed,
          status: isOccupied ? 'available' : 'occupied',
          patient: isOccupied ? null : { name: 'Emergency Admit', condition: 'Observation' }
        });
      }
    }, 10000); // Changed to 10s so it's less chaotic
    
    return () => clearInterval(interval);
  }, [beds, shifts]);

  return (
    <AppContext.Provider value={{ beds, shifts, updateBed, updateShift, stats, logs }}>
      {children}
    </AppContext.Provider>
  );
};