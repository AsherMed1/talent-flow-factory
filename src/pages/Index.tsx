
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { RoleManager } from '@/components/RoleManager';
import { ApplicantPipeline } from '@/components/ApplicantPipeline';
import { CandidateCRM } from '@/components/CandidateCRM';
import { InterviewNotes } from '@/components/InterviewNotes';
import { CandidateImport } from '@/components/CandidateImport';
import { Analytics } from '@/components/Analytics';
import { Settings } from '@/components/Settings';
import { InterviewGuideManager } from '@/components/InterviewGuideManager';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useIsMobile } from '@/hooks/useIsMobile';

const Index = () => {
  // Enhanced safety check for React hooks availability
  if (!React || typeof React.useState !== 'function' || typeof React.useEffect !== 'function') {
    console.error('React hooks not available in Index component');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-600">Loading Error</h1>
          <p className="text-gray-600 mt-2">React is not properly initialized. Please refresh the page.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const [activeView, setActiveView] = React.useState('dashboard');
  const isMobile = useIsMobile();
  const location = useLocation();

  // Handle navigation from QuickActions buttons
  React.useEffect(() => {
    const handleSetActiveView = (event: CustomEvent) => {
      setActiveView(event.detail);
    };

    window.addEventListener('setActiveView', handleSetActiveView as EventListener);
    
    return () => {
      window.removeEventListener('setActiveView', handleSetActiveView as EventListener);
    };
  }, []);

  // Handle navigation state from router
  React.useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        );
      case 'roles':
        return (
          <ErrorBoundary>
            <RoleManager />
          </ErrorBoundary>
        );
      case 'pipeline':
        return (
          <ErrorBoundary>
            <ApplicantPipeline />
          </ErrorBoundary>
        );
      case 'interview-notes':
        return (
          <ErrorBoundary>
            <InterviewNotes />
          </ErrorBoundary>
        );
      case 'interview-guides':
        return (
          <ErrorBoundary>
            <InterviewGuideManager />
          </ErrorBoundary>
        );
      case 'import':
        return (
          <ErrorBoundary>
            <CandidateImport />
          </ErrorBoundary>
        );
      case 'crm':
        return (
          <ErrorBoundary>
            <CandidateCRM />
          </ErrorBoundary>
        );
      case 'analytics':
        return (
          <ErrorBoundary>
            <Analytics />
          </ErrorBoundary>
        );
      case 'settings':
        return (
          <ErrorBoundary>
            <Settings />
          </ErrorBoundary>
        );
      default:
        return (
          <ErrorBoundary>
            <Dashboard />
          </ErrorBoundary>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'flex flex-col pb-16' : 'flex'} w-full`}>
        <ErrorBoundary>
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
        </ErrorBoundary>
        <main className={`${isMobile ? 'flex-1 overflow-auto' : 'flex-1 overflow-hidden'}`}>
          {renderActiveView()}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
