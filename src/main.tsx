import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import './index.css';

// Register Service Worker for 100% Offline PWA Capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const baseUrl = import.meta.env.BASE_URL || './';
    const swUrl = baseUrl.endsWith('/') ? `${baseUrl}sw.js` : `${baseUrl}/sw.js`;
    navigator.serviceWorker.register(swUrl).then(
      (reg) => {
        console.log('SurvivaTrack Offline Service Worker registered:', reg.scope);
      },
      (err) => {
        console.warn('Service Worker registration failed:', err);
      }
    );
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
