import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import MaintenancePage from './pages/MaintenancePage.tsx';
import './index.css';

// ── Maintenance mode gate ──────────────────────────────────────
// Hardcoded to true for instant deployment. 
// Change to 'false' (or use env variable) to disable.
const MAINTENANCE = true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {MAINTENANCE ? <MaintenancePage /> : <App />}
  </StrictMode>
);
