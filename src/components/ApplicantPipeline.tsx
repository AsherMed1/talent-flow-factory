import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/hooks/useApplications';
import { PipelineOverview } from './pipeline/PipelineOverview';
import { KanbanBoard } from './pipeline/KanbanBoard';
import { SearchAndFilters } from './pipeline/SearchAndFilters';
import { TestStatusReset } from './pipeline/TestStatusReset';
import { useIsMobile } from '@/hooks/useIsMobile';

export const ApplicantPipeline = () => {
  const { data: applications, isLoading } = useApplications();
  const [filteredApplications, setFilteredApplications] = useState(applications || []);
  const isMobile = useIsMobile();

  // Update filtered applications when data changes
  React.useEffect(() => {
    if (applications) {
      setFilteredApplications(applications);
    }
  }, [applications]);

  if (isLoading) {
    return (
      <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-6`}>
        <div className="flex items-center justify-between">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900`}>
            Hiring Pipeline
          </h1>
        </div>
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'}`}>
          {Array.from({ length: isMobile ? 4 : 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
                <div className={`${isMobile ? 'h-12' : 'h-16'} bg-gray-200 rounded`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'p-4' : 'p-6'} space-y-6`}>
      {/* Test Reset Button */}
      <TestStatusReset />
      
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

      {/* Kanban Board - Now responsive */}
      <KanbanBoard applications={filteredApplications} />

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
