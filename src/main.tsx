
import * as React from 'react';

// Ensure React is available globally IMMEDIATELY and SYNCHRONOUSLY
const globalReactSetup = () => {
  // Get all possible global contexts
  const contexts = [window, globalThis];
  if (typeof global !== 'undefined') contexts.push(global);
  if (typeof self !== 'undefined') contexts.push(self);
  
  // Set React on all contexts synchronously
  contexts.forEach(context => {
    if (context && typeof context === 'object') {
      // Set the main React export
      context.React = React;
      
      // Set all individual hooks and utilities
      context.useState = React.useState;
      context.useEffect = React.useEffect;
      context.useContext = React.useContext;
      context.useReducer = React.useReducer;
      context.useCallback = React.useCallback;
      context.useMemo = React.useMemo;
      context.useRef = React.useRef;
      context.useLayoutEffect = React.useLayoutEffect;
      context.createElement = React.createElement;
      context.Component = React.Component;
      context.Fragment = React.Fragment;
      context.forwardRef = React.forwardRef;
      context.createContext = React.createContext;
      context.cloneElement = React.cloneElement;
      context.isValidElement = React.isValidElement;
    }
  });
};

// Execute setup immediately and synchronously
globalReactSetup();

// Verify setup worked
console.log('React Global Setup Check:', {
  windowReact: typeof window?.React,
  windowUseState: typeof window?.useState,
  globalThisReact: typeof globalThis?.React,
  globalThisUseState: typeof globalThis?.useState
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
