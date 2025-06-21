
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider delayDuration={300}>
        <div className="min-h-screen w-full">
          <Toaster />
          <Sonner />
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
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
