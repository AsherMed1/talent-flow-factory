
// Ensure React is available IMMEDIATELY and SYNCHRONOUSLY
import * as React from 'react';

// Set up React globally before ANY other imports
const setupReact = () => {
  // Set on window for browser compatibility
  if (typeof window !== 'undefined') {
    (window as any).React = React;
    (window as any).useState = React.useState;
    (window as any).useEffect = React.useEffect;
    (window as any).useContext = React.useContext;
    (window as any).useReducer = React.useReducer;
    (window as any).useCallback = React.useCallback;
    (window as any).useMemo = React.useMemo;
    (window as any).useRef = React.useRef;
    (window as any).useLayoutEffect = React.useLayoutEffect;
    (window as any).createElement = React.createElement;
    (window as any).Component = React.Component;
    (window as any).Fragment = React.Fragment;
    (window as any).forwardRef = React.forwardRef;
    (window as any).createContext = React.createContext;
  }

  // Set on globalThis for Node.js compatibility
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).React = React;
    (globalThis as any).useState = React.useState;
    (globalThis as any).useEffect = React.useEffect;
    (globalThis as any).useContext = React.useContext;
    (globalThis as any).useReducer = React.useReducer;
    (globalThis as any).useCallback = React.useCallback;
    (globalThis as any).useMemo = React.useMemo;
    (globalThis as any).useRef = React.useRef;
    (globalThis as any).useLayoutEffect = React.useLayoutEffect;
    (globalThis as any).createElement = React.createElement;
    (globalThis as any).Component = React.Component;
    (globalThis as any).Fragment = React.Fragment;
    (globalThis as any).forwardRef = React.forwardRef;
    (globalThis as any).createContext = React.createContext;
  }
};

// Execute setup immediately
setupReact();

// Verify React is available
console.log('main.tsx - React setup verification:', {
  React: !!React,
  useState: !!React.useState,
  windowReact: !!(window as any)?.React,
  windowUseState: !!(window as any)?.useState,
  globalReact: !!(globalThis as any)?.React,
  globalUseState: !!(globalThis as any)?.useState
});

// Now import everything else
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from './utils/serviceWorker';

// Additional safety check before rendering
if (!React || !React.useState) {
  throw new Error('React hooks are not available. This is a critical error.');
}

// Initialize the app
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Render with additional error boundary
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
