import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 1. Target the 'root' div from your HTML
const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);