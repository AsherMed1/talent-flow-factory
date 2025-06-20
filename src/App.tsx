
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Index from "./pages/Index";
import { ApplyPage } from "./pages/ApplyPage";
import { VideoEditorApplicationPage } from "./pages/VideoEditorApplicationPage";
import { AppointmentSetterApplicationPage } from "./pages/AppointmentSetterApplicationPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { VideoLibraryPage } from "./pages/VideoLibraryPage";
import { GmailCallbackPage } from "./pages/GmailCallbackPage";
import { WebhookProcessorPage } from "./pages/WebhookProcessorPage";
import { NotFound } from "./pages/NotFound";
import { Settings } from "./components/Settings";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes without sidebar */}
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/apply/video-editor" element={<VideoEditorApplicationPage />} />
            <Route path="/apply/appointment-setter" element={<AppointmentSetterApplicationPage />} />
            <Route path="/thank-you" element={<ThankYouPage />} />
            <Route path="/gmail-callback" element={<GmailCallbackPage />} />
            <Route path="/webhook-processor" element={<WebhookProcessorPage />} />
            
            {/* Routes with sidebar */}
            <Route path="/*" element={
              <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/video-library" element={<VideoLibraryPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
