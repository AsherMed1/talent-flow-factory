
// CRITICAL: React must be available IMMEDIATELY and SYNCHRONOUSLY
import * as React from 'react';

// Immediate, synchronous React setup - MUST happen before any other imports
const setupReactGlobally = () => {
  console.log('Setting up React globally...');
  
  // Define all React exports we need to make available
  const reactExports = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useContext: React.useContext,
    useReducer: React.useReducer,
    useCallback: React.useCallback,
    useMemo: React.useMemo,
    useRef: React.useRef,
    useLayoutEffect: React.useLayoutEffect,
    createElement: React.createElement,
    Component: React.Component,
    Fragment: React.Fragment,
    forwardRef: React.forwardRef,
    createContext: React.createContext,
    memo: React.memo,
    useImperativeHandle: React.useImperativeHandle,
    useDeferredValue: React.useDeferredValue,
    useTransition: React.useTransition,
    useId: React.useId,
    useSyncExternalStore: React.useSyncExternalStore
  };

  // Set up on window (browser)
  if (typeof window !== 'undefined') {
    Object.assign(window, reactExports);
    (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
  }

  // Set up on globalThis (universal)
  if (typeof globalThis !== 'undefined') {
    Object.assign(globalThis, reactExports);
  }

  // Set up on global (Node.js compatibility)
  if (typeof global !== 'undefined') {
    Object.assign(global, reactExports);
  }
  
  console.log('React setup complete:', {
    React: !!React,
    useState: !!React.useState,
    windowReact: !!(window as any)?.React,
    globalReact: !!(globalThis as any)?.React
  });
};

// Execute setup IMMEDIATELY
setupReactGlobally();

// Verify React is available
if (!React || !React.useState) {
  throw new Error('CRITICAL: React hooks are not available after setup');
}

// Now import everything else
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from './utils/serviceWorker';

// Final verification before rendering
console.log('Final React verification before render:', {
  React: !!React,
  useState: !!React?.useState,
  useEffect: !!React?.useEffect,
  windowReact: !!(window as any)?.React,
  windowUseState: !!(window as any)?.useState
});

if (!React?.useState || !React?.useEffect) {
  throw new Error('React hooks verification failed - cannot proceed with render');
}

// Initialize the app
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Render with error boundary
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
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
