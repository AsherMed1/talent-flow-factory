
// CRITICAL: Import and setup React FIRST before anything else
import React from 'react';
import ReactDOM from 'react-dom/client';

// IMMEDIATE: Setup React globally BEFORE any other imports
(function setupReactImmediately() {
  // Make React available in ALL possible global contexts immediately
  const allContexts = [window, globalThis];
  
  if (typeof global !== 'undefined') {
    allContexts.push(global);
  }
  
  if (typeof self !== 'undefined') {
    allContexts.push(self);
  }
  
  allContexts.forEach(context => {
    if (context) {
      context.React = React;
      // Make ALL React exports directly available
      Object.assign(context, React);
    }
  });

  // CRITICAL: Intercept ALL possible module resolution paths
  if (typeof window !== 'undefined') {
    // Create a comprehensive React module that covers all import patterns
    const completeReactModule = {
      ...React,
      React,
      default: React,
      __esModule: true
    };

    // Override ALL possible React resolution mechanisms
    window.__REACT_GLOBAL__ = completeReactModule;
    window.React = React;
    
    // Ensure React is available for dynamic imports
    if (!window.__vite_plugin_react_preamble_installed__) {
      window.__vite_plugin_react_preamble_installed__ = true;
      
      // Intercept ES module imports
      const originalImport = window.__vitePreload || window.import;
      if (originalImport) {
        window.__vitePreload = window.import = function(url, ...args) {
          if (url.includes('react') && !url.includes('react-dom')) {
            return Promise.resolve(completeReactModule);
          }
          return originalImport.call(this, url, ...args);
        };
      }
    }
  }

  // Enhanced CommonJS support
  if (typeof require !== 'undefined' && require.cache) {
    const reactExports = {
      ...React,
      React,
      default: React,
      __esModule: true
    };
    
    // Cover every possible React module path
    const allReactPaths = [
      'react',
      '/react',
      './react',
      '../react',
      'node_modules/react',
      '/node_modules/react',
      './node_modules/react',
      '../node_modules/react',
      '/node_modules/react/index.js',
      'react/index.js'
    ];
    
    allReactPaths.forEach(path => {
      try {
        require.cache[path] = {
          exports: reactExports,
          loaded: true,
          id: path,
          filename: path,
          children: []
        };
      } catch (e) {
        // Continue with other paths
      }
    });
  }

  // AMD/RequireJS support
  if (typeof define !== 'undefined' && define.amd) {
    define('react', [], function() { return React; });
  }

  // SystemJS support
  if (typeof System !== 'undefined') {
    System.set('react', React);
  }
})();

// Additional verification
console.log('🔧 Enhanced React Global Setup:', {
  React: typeof React,
  ReactVersion: React.version,
  windowReact: typeof window?.React,
  globalThisReact: typeof globalThis?.React,
  allHooksAvailable: {
    useState: typeof React.useState,
    useEffect: typeof React.useEffect,
    useContext: typeof React.useContext
  }
});

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
