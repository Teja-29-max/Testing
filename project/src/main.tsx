import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { logger } from './services/loggingService';

// Initialize application logging
logger.info('Application initialization started', 'Main', 'init', {
  environment: process.env.NODE_ENV || 'development',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  timestamp: new Date().toISOString()
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

logger.info('React application mounted successfully', 'Main', 'init');