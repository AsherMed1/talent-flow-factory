
import { Suspense } from "react";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LazyIndex,
  LazyApplyPage,
  LazyVideoEditorApplicationPage,
  LazyAppointmentSetterApplicationPage,
  LazyThankYouPage,
  LazyPublicJobBoard,
  LazyGmailCallbackPage,
  LazyNotFound
} from "./components/LazyComponents";

// Ensure React hooks are globally available for all components
if (typeof window !== 'undefined') {
  const contexts = [window as any, globalThis as any];
  
  contexts.forEach(context => {
    if (context && (!context.React || !context.useEffect)) {
      context.React = React;
      context.useState = React.useState;
      context.useEffect = React.useEffect;
      context.useContext = React.useContext;
      context.useCallback = React.useCallback;
      context.useMemo = React.useMemo;
      context.useRef = React.useRef;
      context.useReducer = React.useReducer;
      context.useLayoutEffect = React.useLayoutEffect;
      context.createElement = React.createElement;
      context.Component = React.Component;
      context.Fragment = React.Fragment;
      context.forwardRef = React.forwardRef;
      context.createContext = React.createContext;
    }
  });
}

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

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen w-full">
          <Toaster />
          <Sonner />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LazyIndex />} />
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
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
