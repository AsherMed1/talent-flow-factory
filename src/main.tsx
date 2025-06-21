
// Make React available globally BEFORE any imports
import * as React from 'react';

// Ensure React is available in multiple ways for maximum compatibility
if (typeof window !== 'undefined') {
  (window as any).React = React;
  Object.assign(window as any, {
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
  });
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
  Object.assign(globalThis as any, {
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
  });
}

console.log('main.tsx - React setup complete:', {
  React: !!React,
  useState: !!React.useState,
  windowReact: !!(window as any).React,
  globalReact: !!(globalThis as any).React
});

// Now import everything else
import ReactDOM from 'react-dom/client';
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
