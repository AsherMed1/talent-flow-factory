
// CRITICAL: Import and setup React FIRST before anything else
import React from 'react';
import ReactDOM from 'react-dom/client';

// Make React available globally and in module system IMMEDIATELY
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
  
  // CRITICAL: Make React available in module system
  try {
    // @ts-ignore
    if (typeof module !== 'undefined' && module.exports) {
      module.exports.React = React;
      module.exports.default = React;
    }
    
    // @ts-ignore - Make React available for CommonJS requires
    if (typeof require !== 'undefined' && require.cache) {
      const reactModule = {
        exports: React,
        default: React,
        ...React
      };
      // @ts-ignore
      require.cache['react'] = { exports: reactModule };
    }
  } catch (e) {
    console.warn('Module system setup warning:', e);
  }
};

// Execute immediately and synchronously
makeReactGlobal();

// Verify setup with comprehensive logging
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

import App from './App.tsx';
import './index.css';
import { registerSW } from './utils/serviceWorker';

// Initialize the app synchronously
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Render immediately
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
