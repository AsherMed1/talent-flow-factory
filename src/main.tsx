
import React from 'react';

// CRITICAL: Make React globally available immediately before any other imports
// This ensures third-party libraries like @tanstack/react-query and @radix-ui get proper React access
if (typeof window !== 'undefined') {
  (window as any).React = React;
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
    useLayoutEffect: React.useLayoutEffect,
    createElement: React.createElement,
    Component: React.Component,
    Fragment: React.Fragment,
    forwardRef: React.forwardRef,
    createContext: React.createContext
  });
}

// Now import everything else AFTER React is globally available
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from './utils/serviceWorker';

console.log('React Global Setup:', {
  windowReact: typeof (window as any)?.React,
  windowUseState: typeof (window as any)?.useState,
  globalReact: typeof (globalThis as any)?.React,
  globalUseState: typeof (globalThis as any)?.useState
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
