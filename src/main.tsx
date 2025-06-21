
// CRITICAL: Ensure React is available globally BEFORE any other imports
import React from 'react';

// Set up React globally with more comprehensive approach
(function setupReactGlobally() {
  // Ensure React is available on window
  if (typeof window !== 'undefined') {
    (window as any).React = React;
    (window as any).useState = React.useState;
    (window as any).useContext = React.useContext;
    (window as any).useEffect = React.useEffect;
    (window as any).useCallback = React.useCallback;
    (window as any).useMemo = React.useMemo;
    (window as any).useRef = React.useRef;
    (window as any).useReducer = React.useReducer;
  }

  // Ensure React is available on globalThis
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).React = React;
    (globalThis as any).useState = React.useState;
    (globalThis as any).useContext = React.useContext;
    (globalThis as any).useEffect = React.useEffect;
    (globalThis as any).useCallback = React.useCallback;
    (globalThis as any).useMemo = React.useMemo;
    (globalThis as any).useRef = React.useRef;
    (globalThis as any).useReducer = React.useReducer;
  }

  // Ensure React is available globally (fallback)
  if (typeof global !== 'undefined') {
    (global as any).React = React;
    (global as any).useState = React.useState;
    (global as any).useContext = React.useContext;
    (global as any).useEffect = React.useEffect;
    (global as any).useCallback = React.useCallback;
    (global as any).useMemo = React.useMemo;
    (global as any).useRef = React.useRef;
    (global as any).useReducer = React.useReducer;
  }
})();

// Verify React is properly set up
console.log('React global setup verification:', {
  windowReact: typeof (window as any)?.React,
  globalThisReact: typeof (globalThis as any)?.React,
  reactVersion: React.version,
  hooksAvailable: {
    useState: typeof (window as any)?.useState,
    useContext: typeof (window as any)?.useContext,
    useEffect: typeof (window as any)?.useEffect
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
