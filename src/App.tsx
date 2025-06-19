
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ApplyPage } from "./pages/ApplyPage";
import { VideoEditorApplicationPage } from "./pages/VideoEditorApplicationPage";
import { AppointmentSetterApplicationPage } from "./pages/AppointmentSetterApplicationPage";
import { ThankYouPage } from "./pages/ThankYouPage";
import { PublicJobBoard } from "./components/PublicJobBoard";
import GmailCallbackPage from "./pages/GmailCallbackPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<PublicJobBoard />} />
          <Route path="/apply/:roleId" element={<ApplyPage />} />
          <Route path="/apply" element={<ApplyPage />} />
          <Route path="/apply/video-editor" element={<VideoEditorApplicationPage />} />
          <Route path="/apply/appointment-setter" element={<AppointmentSetterApplicationPage />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
          <Route path="/auth/gmail/callback" element={<GmailCallbackPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
