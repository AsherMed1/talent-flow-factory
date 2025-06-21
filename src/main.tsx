
// CRITICAL: Import and setup React FIRST before anything else
import React from 'react';

// Immediately set React globally with comprehensive coverage
if (typeof window !== 'undefined') {
  (window as any).React = React;
  Object.assign(window, React);
}
if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
  Object.assign(globalThis, React);
}
if (typeof global !== 'undefined') {
  (global as any).React = React;
  Object.assign(global, React);
}

// Also ensure hooks are directly available
const hooks = {
  useState: React.useState,
  useEffect: React.useEffect,
  useContext: React.useContext,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useRef: React.useRef,
  useReducer: React.useReducer,
  useLayoutEffect: React.useLayoutEffect,
};

if (typeof window !== 'undefined') {
  Object.assign(window, hooks);
}
if (typeof globalThis !== 'undefined') {
  Object.assign(globalThis, hooks);
}
if (typeof global !== 'undefined') {
  Object.assign(global, hooks);
}

// Verify setup
console.log('React setup verification:', {
  React: typeof React,
  windowReact: typeof (window as any)?.React,
  globalReact: typeof (globalThis as any)?.React,
  useState: typeof (window as any)?.useState,
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
