
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/hooks/useApplications';
import { useRealtimeApplications } from '@/hooks/useRealtimeApplications';
import { PipelineOverview } from './pipeline/PipelineOverview';
import { KanbanBoard } from './pipeline/KanbanBoard';
import { SearchAndFilters } from './pipeline/SearchAndFilters';
import { useIsMobile } from '@/hooks/useIsMobile';

// Safety check function
const checkReactAvailability = () => {
  const checks = {
    React: !!React,
    useState: !!React?.useState,
    windowReact: !!(window as any)?.React,
    windowUseState: !!(window as any)?.useState,
    globalReact: !!(globalThis as any)?.React,
    globalUseState: !!(globalThis as any)?.useState
  };
  
  console.log('ApplicantPipeline - React availability:', checks);
  
  return checks.React && checks.useState;
};

export const ApplicantPipeline = () => {
  // Immediate safety check
  if (!checkReactAvailability()) {
    console.error('React hooks not available in ApplicantPipeline');
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline</h1>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Unable to load pipeline. React hooks are not available.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const { data: applications, isLoading, dataUpdatedAt } = useApplications();
  const [filteredApplications, setFilteredApplications] = useState(applications || []);
  const isMobile = useIsMobile();

  console.log("Before useRealtimeApplications");
  // Enable real-time updates for the pipeline
  useRealtimeApplications();
  console.log("After useRealtimeApplications");

  // Update filtered applications when data changes
  React.useEffect(() => {
    console.log('🏢 Pipeline data updated at:', new Date(dataUpdatedAt));
    console.log('🏢 Applications in pipeline:', {
      total: applications?.length || 0,
      filtered: filteredApplications.length,
      dataUpdatedAt: new Date(dataUpdatedAt).toLocaleTimeString()
    });
    
    if (applications) {
      setFilteredApplications(applications);
    }
  }, [applications, dataUpdatedAt]);

  if (isLoading) {
    return (
      <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-6`}>
        <div className="flex items-center justify-between">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
            {isMobile ? 'Pipeline' : 'Hiring Pipeline'}
          </h1>
        </div>
        <KanbanBoard applications={[]} isLoading={true} />
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-6`}>
      
      <div className="flex items-center justify-between">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
          {isMobile ? 'Pipeline' : 'Hiring Pipeline'}
        </h1>
        {!isMobile && (
          <div className="flex gap-2">
            <Button variant="outline">Export Data</Button>
          </div>
        )}
      </div>

      {/* Search and Filters - Optimized for mobile */}
      <SearchAndFilters 
        applications={applications || []} 
        onFilteredApplications={setFilteredApplications}
      />

      {/* Results Summary */}
      {applications && filteredApplications.length !== applications.length && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-800`}>
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </div>
      )}

      {/* Pipeline Overview - Hide on mobile if too cluttered */}
      {!isMobile && <PipelineOverview applications={filteredApplications} />}

      {/* Kanban Board - Now responsive with enhanced UX */}
      <KanbanBoard applications={filteredApplications} isLoading={false} />

      {/* Mobile Export Button */}
      {isMobile && (
        <div className="fixed bottom-4 right-4">
          <Button className="rounded-full shadow-lg">
            Export
          </Button>
        </div>
      )}
    </div>
  );
};
