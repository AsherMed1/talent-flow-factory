
// CRITICAL: Import and setup React FIRST before anything else
import React from 'react';

// Make React available globally IMMEDIATELY and comprehensively
const makeReactGlobal = () => {
  const contexts = [window, globalThis];
  
  if (typeof global !== 'undefined') {
    contexts.push(global);
  }
  
  contexts.forEach(context => {
    if (context) {
      context.React = React;
      // Make all React hooks directly available
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
        Fragment: React.Fragment
      });
    }
  });
};

// Execute immediately
makeReactGlobal();

// Also try to inject into module system
try {
  // @ts-ignore
  if (typeof module !== 'undefined') {
    module.exports = module.exports || {};
    module.exports.React = React;
    module.exports.default = React;
  }
} catch (e) {
  // Ignore module errors
}

// Verify setup with more comprehensive logging
console.log('🔧 React Global Setup Verification:', {
  React: typeof React,
  windowReact: typeof (window as any)?.React,
  globalThisReact: typeof (globalThis as any)?.React,
  windowUseState: typeof (window as any)?.useState,
  windowUseContext: typeof (window as any)?.useContext,
  reactVersion: React.version,
  reactHooks: {
    useState: typeof React.useState,
    useEffect: typeof React.useEffect,
    useContext: typeof React.useContext,
  }
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
