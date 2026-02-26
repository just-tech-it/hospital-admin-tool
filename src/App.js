import React from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts'; // <--- Don't forget this import!
import './index.css';

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        {/* Alerts usually go at the top so they are visible immediately */}
        <Alerts /> 
        <Dashboard />
      </div>
    </AppProvider>
  );
}

export default App;