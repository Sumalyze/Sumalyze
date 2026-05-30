import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import MaintenancePage from './pages/MaintenancePage.tsx';
import './index.css';

// ── Maintenance mode gate ──────────────────────────────────────
// Set VITE_MAINTENANCE_MODE=true in your .env (or Netlify env vars)
// to show only the maintenance page and block all routes.
const MAINTENANCE = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {MAINTENANCE ? <MaintenancePage /> : <App />}
  </StrictMode>
);
