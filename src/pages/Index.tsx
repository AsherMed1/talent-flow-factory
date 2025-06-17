
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { RoleManager } from '@/components/RoleManager';
import { ApplicantPipeline } from '@/components/ApplicantPipeline';
import { CandidateCRM } from '@/components/CandidateCRM';
import { CandidateImport } from '@/components/CandidateImport';
import { Analytics } from '@/components/Analytics';
import { Settings } from '@/components/Settings';
import { useIsMobile } from '@/hooks/useIsMobile';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const isMobile = useIsMobile();

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'roles':
        return <RoleManager />;
      case 'pipeline':
        return <ApplicantPipeline />;
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
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'flex flex-col' : 'flex'}`}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className={`${isMobile ? 'flex-1 overflow-auto' : 'flex-1 overflow-hidden'}`}>
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Index;
