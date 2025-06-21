
import React from 'react';

// CRITICAL: Ensure React is available globally BEFORE anything else
(window as any).React = React;
if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
}

// Also ensure individual hooks are available
(window as any).useState = React.useState;
(window as any).useContext = React.useContext;
(window as any).useEffect = React.useEffect;

// Add debugging to confirm React is available
console.log('React global setup:', {
  windowReact: !!(window as any).React,
  globalThisReact: !!(globalThis as any).React,
  reactVersion: React.version,
  hooksAvailable: {
    useState: typeof (window as any).useState,
    useContext: typeof (window as any).useContext,
    useEffect: typeof (window as any).useEffect
  }
});

import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from './utils/serviceWorker';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register service worker for caching and offline functionality
registerSW({
  onSuccess: () => {
    console.log('Service worker registered successfully');
  },
  onUpdate: () => {
    console.log('New content available, please refresh');
  }
});
