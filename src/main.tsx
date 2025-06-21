
import * as React from 'react';
import ReactDOM from 'react-dom/client';

// Ensure React is available globally for third-party libraries
// This must happen before any other imports that might use React
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

// Now import everything else
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
