
// CRITICAL: Import and setup React FIRST before anything else
import React from 'react';
import ReactDOM from 'react-dom/client';

// Simple and safe React global setup
(function setupReactImmediately() {
  // Make React available globally for compatibility
  if (typeof window !== 'undefined') {
    (window as any).React = React;
    
    // Make React hooks available globally
    Object.assign(window as any, {
      React,
      useState: React.useState,
      useEffect: React.useEffect,
      useContext: React.useContext,
      useCallback: React.useCallback,
      useMemo: React.useMemo,
      useRef: React.useRef,
      useReducer: React.useReducer,
      useLayoutEffect: React.useLayoutEffect,
      createElement: React.createElement,
      Component: React.Component,
      Fragment: React.Fragment,
      forwardRef: React.forwardRef,
      createContext: React.createContext
    });
  }

  // Also make available on globalThis
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).React = React;
    Object.assign(globalThis as any, {
      React,
      useState: React.useState,
      useEffect: React.useEffect,
      useContext: React.useContext,
      useCallback: React.useCallback,
      useMemo: React.useMemo,
      useRef: React.useRef,
      useReducer: React.useReducer,
      useLayoutEffect: React.useLayoutEffect
    });
  }
})();

// Enhanced verification
console.log('🔧 Enhanced React Global Setup:', {
  React: typeof React,
  ReactVersion: React.version,
  windowReact: typeof (window as any)?.React,
  globalThisReact: typeof (globalThis as any)?.React,
  allHooksAvailable: {
    useState: typeof React.useState,
    useEffect: typeof React.useEffect,
    useContext: typeof React.useContext
  }
});

import App from './App.tsx';
import './index.css';
import { registerSW } from './utils/serviceWorker';

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
