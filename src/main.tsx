
// CRITICAL: React MUST be the very first thing available
import React from 'react';

// Immediately make React available globally BEFORE any other imports
if (typeof window !== 'undefined') {
  (window as any).React = React;
  // Make all React exports available
  Object.assign(window as any, React);
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
  Object.assign(globalThis as any, React);
}

// Now import everything else AFTER React is globally available
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from './utils/serviceWorker';

console.log('✅ React Setup Complete:', {
  React: typeof React,
  windowReact: typeof (window as any)?.React,
  globalReact: typeof (globalThis as any)?.React,
  useEffect: typeof React.useEffect
});

// Initialize the app
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register service worker
registerSW({
  onSuccess: () => {
    console.log('Service worker registered successfully');
  },
  onUpdate: () => {
    console.log('New content available, please refresh');
  }
});
