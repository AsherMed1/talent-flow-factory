
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { RoleManager } from '@/components/RoleManager';
import { ApplicantPipeline } from '@/components/ApplicantPipeline';
import { CandidateCRM } from '@/components/CandidateCRM';
import { Analytics } from '@/components/Analytics';
import { Settings } from '@/components/Settings';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

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
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 overflow-hidden">
        {renderActiveView()}
      </main>
    </div>
  );
};

export default Index;
