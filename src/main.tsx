

// CRITICAL: Import and setup React FIRST before anything else
import React from 'react';
import ReactDOM from 'react-dom/client';

// COMPREHENSIVE: Make React available globally and in ALL module systems IMMEDIATELY and SYNCHRONOUSLY
(function setupReactGloballyAndInModuleSystems() {
  const contexts = [window, globalThis];
  
  if (typeof global !== 'undefined') {
    contexts.push(global);
  }
  
  // Make React available in all global contexts
  contexts.forEach(context => {
    if (context) {
      context.React = React;
      // Make all React hooks and components directly available
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
        createContext: React.createContext
      });
    }
  });
  
  // CRITICAL: Make React available in ALL possible module system paths
  try {
    // CommonJS module system
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = React;
      module.exports.React = React;
      module.exports.default = React;
      Object.assign(module.exports, React);
    }
    
    // Comprehensive require() cache setup for CommonJS
    if (typeof require !== 'undefined') {
      if (require.cache) {
        const reactModuleExports = {
          ...React,
          default: React,
          React
        };
        
        // Cover all possible React import paths
        const reactPaths = [
          'react',
          '/node_modules/react',
          '/node_modules/react/index.js',
          './node_modules/react',
          '../node_modules/react'
        ];
        
        reactPaths.forEach(path => {
          try {
            // Simple exports object without NodeModule properties
            require.cache[path] = { exports: reactModuleExports } as any;
          } catch (e) {
            // Ignore individual path failures
          }
        });
      }
    }
    
    // AMD system (define.js, RequireJS)
    if (typeof window !== 'undefined' && (window as any).define && (window as any).define.amd) {
      (window as any).define('react', [], function() { return React; });
      (window as any).define('React', [], function() { return React; });
    }
    
    // SystemJS
    if (typeof window !== 'undefined' && (window as any).System) {
      (window as any).System.set('react', React);
      (window as any).System.set('React', React);
    }
    
    // ES6 Module system - make React available for dynamic imports
    if (typeof window !== 'undefined') {
      (window as any).__REACT_MODULE__ = React;
      (window as any).reactModule = React;
    }
    
  } catch (e) {
    console.warn('Some module system setup failed, but continuing:', e);
  }
})();

// Additional verification and comprehensive logging
console.log('🔧 COMPREHENSIVE React Global Setup Verification:', {
  React: typeof React,
  ReactVersion: React.version,
  globalContexts: {
    windowReact: typeof (window as any)?.React,
    globalThisReact: typeof (globalThis as any)?.React,
    globalReact: typeof global !== 'undefined' ? typeof (global as any)?.React : 'not available'
  },
  hooks: {
    windowUseState: typeof (window as any)?.useState,
    windowUseContext: typeof (window as any)?.useContext,
    windowUseEffect: typeof (window as any)?.useEffect,
    reactUseState: typeof React.useState,
    reactUseEffect: typeof React.useEffect,
    reactUseContext: typeof React.useContext,
    reactUseCallback: typeof React.useCallback,
    reactUseMemo: typeof React.useMemo,
    reactUseRef: typeof React.useRef,
    reactCreateContext: typeof React.createContext,
    reactForwardRef: typeof React.forwardRef
  },
  moduleSystem: {
    moduleExports: typeof module !== 'undefined' ? typeof module.exports : 'undefined',
    requireCache: typeof require !== 'undefined' ? typeof require.cache : 'undefined',
    amdDefine: typeof window !== 'undefined' ? typeof (window as any).define : 'undefined'
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

