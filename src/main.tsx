
import React from 'react';

// Ensure React is available globally IMMEDIATELY, before any other imports
(window as any).React = React;
if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
}

// Add debugging to confirm React is available
console.log('React global setup:', {
  windowReact: !!(window as any).React,
  globalThisReact: !!(globalThis as any).React,
  reactVersion: React.version
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
