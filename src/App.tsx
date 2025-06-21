
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

// CRITICAL: Force module-level React availability for bundled libraries
if (typeof module !== 'undefined' && module.exports) {
  module.exports.React = React;
}

// Force immediate verification
console.log('App.tsx - CRITICAL React verification:', {
  React: !!React,
  useState: !!React?.useState,
  useEffect: !!React?.useEffect,
  windowReact: !!(window as any)?.React,
  windowUseState: !!(window as any)?.useState,
  globalReact: !!(globalThis as any)?.React
});

// CRITICAL: Verify React is available before proceeding
if (!React || !React.useState || !React.useEffect) {
  console.error('App.tsx - CRITICAL: React is not properly initialized');
  throw new Error('React initialization failed in App.tsx - cannot proceed');
}

import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; // Direct import instead of lazy loading
import {
  LazyApplyPage,
  LazyVideoEditorApplicationPage,
  LazyAppointmentSetterApplicationPage,
  LazyThankYouPage,
  LazyPublicJobBoard,
  LazyGmailCallbackPage,
  LazyNotFound
} from "./components/LazyComponents";

// Optimized QueryClient configuration for better caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

// Make query client globally available for context checks
if (typeof window !== 'undefined') {
  (window as any).__REACT_QUERY_CLIENT__ = queryClient;
}
if (typeof globalThis !== 'undefined') {
  (globalThis as any).__REACT_QUERY_CLIENT__ = queryClient;
}

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const App = () => {
  // Additional safety check at App level
  if (!React || !React.useState || !React.useEffect) {
    console.error('App component: React not available');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-red-600">
          <p className="font-medium">Application Error</p>
          <p className="text-sm mt-1">React is not properly initialized. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen w-full">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<LazyPublicJobBoard />} />
              <Route path="/apply/:roleId" element={<LazyApplyPage />} />
              <Route path="/apply" element={<LazyApplyPage />} />
              <Route path="/apply/video-editor" element={<LazyVideoEditorApplicationPage />} />
              <Route path="/apply/appointment-setter" element={<LazyAppointmentSetterApplicationPage />} />
              <Route path="/thank-you" element={<LazyThankYouPage />} />
              <Route path="/auth/gmail/callback" element={<LazyGmailCallbackPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<LazyNotFound />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
