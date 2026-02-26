import React from 'react';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  return (
    <AppProvider>
      <div className="app-container">
        <Dashboard />
        <Alerts />
      </div>
    </AppProvider>
  );
}

export default App;