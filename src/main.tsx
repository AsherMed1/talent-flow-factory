
import React from 'react';

// CRITICAL: Set up React globally before ANY other imports
// This is essential for third-party libraries to find React hooks
const setupReact = () => {
  const contexts = [window, globalThis];
  
  // Add additional contexts that might exist
  if (typeof global !== 'undefined') contexts.push(global as any);
  if (typeof self !== 'undefined') contexts.push(self as any);
  
  contexts.forEach(context => {
    if (context && typeof context === 'object') {
      // Set React as the main export
      context.React = React;
      
      // Set all React hooks and utilities individually
      Object.assign(context, {
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
        createContext: React.createContext,
        cloneElement: React.cloneElement,
        isValidElement: React.isValidElement
      });
    }
  });
};

// Execute React setup immediately
setupReact();

// Now import everything else
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from './utils/serviceWorker';

// Debug logging
console.log('React Setup Verification:', {
  windowReact: typeof (window as any)?.React,
  windowUseState: typeof (window as any)?.useState,
  globalReact: typeof (globalThis as any)?.React,
  globalUseState: typeof (globalThis as any)?.useState,
  ReactDirect: typeof React,
  ReactUseState: typeof React.useState
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
