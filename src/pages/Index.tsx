
import { useState, useEffect } from 'react';
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
import { useIsMobile } from '@/hooks/useIsMobile';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const isMobile = useIsMobile();
  const location = useLocation();

  // Handle navigation from QuickActions buttons
  useEffect(() => {
    const handleSetActiveView = (event: CustomEvent) => {
      setActiveView(event.detail);
    };

    window.addEventListener('setActiveView', handleSetActiveView as EventListener);
    
    return () => {
      window.removeEventListener('setActiveView', handleSetActiveView as EventListener);
    };
  }, []);

  // Handle navigation state from router
  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'roles':
        return <RoleManager />;
      case 'pipeline':
        return <ApplicantPipeline />;
      case 'interview-notes':
        return <InterviewNotes />;
      case 'interview-guides':
        return <InterviewGuideManager />;
      case 'import':
        return <CandidateImport />;
      case 'crm':
        return <CandidateCRM />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'flex flex-col pb-16' : 'flex'} w-full`}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className={`${isMobile ? 'flex-1 overflow-auto' : 'flex-1 overflow-hidden'}`}>
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Index;
