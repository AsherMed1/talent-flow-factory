
// CRITICAL: React must be available IMMEDIATELY and SYNCHRONOUSLY
import * as React from 'react';

// IMMEDIATE React setup - must happen before ANY other imports
if (typeof window !== 'undefined') {
  (window as any).React = React;
  Object.assign(window, {
    React,
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
    memo: React.memo,
    useImperativeHandle: React.useImperativeHandle,
    useDeferredValue: React.useDeferredValue,
    useTransition: React.useTransition,
    useId: React.useId,
    useSyncExternalStore: React.useSyncExternalStore
  });
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
  Object.assign(globalThis, {
    React,
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
    memo: React.memo,
    useImperativeHandle: React.useImperativeHandle,
    useDeferredValue: React.useDeferredValue,
    useTransition: React.useTransition,
    useId: React.useId,
    useSyncExternalStore: React.useSyncExternalStore
  });
}

// Force immediate verification
console.log('CRITICAL React verification:', {
  React: !!React,
  useState: !!React?.useState,
  useEffect: !!React?.useEffect,
  windowReact: !!(window as any)?.React,
  windowUseState: !!(window as any)?.useState,
  globalReact: !!(globalThis as any)?.React
});

// CRITICAL: Verify React is available before proceeding
if (!React || !React.useState || !React.useEffect) {
  console.error('CRITICAL: React is not properly initialized');
  throw new Error('React initialization failed - cannot proceed');
}

// Now import everything else
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from './utils/serviceWorker';

// Final verification before rendering
console.log('Final verification before App render:', {
  React: !!React,
  useState: !!React?.useState,
  useEffect: !!React?.useEffect,
  windowReact: !!(window as any)?.React,
  windowUseState: !!(window as any)?.useState
});

// Initialize the app
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Render with error boundary
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
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
