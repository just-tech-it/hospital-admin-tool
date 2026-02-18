import { createContext, useState, useContext, useEffect, useMemo} from "react";

export const AppContext = createContext();

export const AppProvider = ({children}) =>{
  const[shifts, setShifts]=useState([]);
  const[beds,setBeds]=useState([]);
  const[alerts,setAlerts]=useState([]);

  useEffect(()=>{
    const loadData = async()=>{
      try {
        const responses = await Promise.all([
          fetch("/data/shifts.json"),
          fetch("/data/beds.json")
        ]);

        const[shiftsData,bedsData] = await Promise.all(
          responses.map(res => res.json())
        );

        setShifts(shiftsData);
        setBeds(bedsData);
      } catch (error){
        console.error("Failed to laod clinical data", error);
      }
    };
    loadData();
  }, []);

  useEffect(()=>{
    if(beds.length===0) return;

    const occupied = beds.filter(b => b.status === "occupied").length;

    if(occupied/beds.length>0.8){
      const newAlert =  {id:Date.now(), message: "⚠ Ward Occupancy > 80% "};
      setAlerts([newAlert]);

      const timer  = setTimeout(()=> setAlerts([]),3000);
      return ()=> clearTimeout(timer);
    }
  },[beds]);

    const updateShift = (updatedShift) => {
      setShifts(prev => prev.map(s => s.id === updatedShift.id? updatedShift : s));
    };

    const updateBed = (updatedBed) => {
      setBeds (prev => prev.map(b => b.id === updatedBed.id? updatedBed : b));
    };

    const value = useMemo(()=>{
      return {shifts, beds, alerts,updateBed, updateShift}
    },[shifts, beds, alerts]);

    return(
      <AppProvider value={value}>
        {children}
      </AppProvider>
    );

};



