
// Import React first
import * as React from 'react';

// Ensure React is available globally BEFORE any other imports
// This is critical for Radix UI and other third-party components
(window as any).React = React;
(globalThis as any).React = React;

// Make all React hooks available globally
const reactHooks = {
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
};

// Set on window
Object.assign(window as any, reactHooks);
// Set on globalThis
Object.assign(globalThis as any, reactHooks);

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
