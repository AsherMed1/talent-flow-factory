
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useApplications } from '@/hooks/useApplications';
import { PipelineOverview } from './pipeline/PipelineOverview';
import { KanbanBoard } from './pipeline/KanbanBoard';
import { SearchAndFilters } from './pipeline/SearchAndFilters';

export const ApplicantPipeline = () => {
  const { data: applications, isLoading } = useApplications();
  const [filteredApplications, setFilteredApplications] = useState(applications || []);

  // Update filtered applications when data changes
  React.useEffect(() => {
    if (applications) {
      setFilteredApplications(applications);
    }
  }, [applications]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="p-4">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hiring Pipeline</h1>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchAndFilters 
        applications={applications || []} 
        onFilteredApplications={setFilteredApplications}
      />

      {/* Results Summary */}
      {applications && filteredApplications.length !== applications.length && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Showing {filteredApplications.length} of {applications.length} applications
          </p>
        </div>
      )}

      {/* Pipeline Overview */}
      <PipelineOverview applications={filteredApplications} />

      {/* Kanban Board */}
      <KanbanBoard applications={filteredApplications} />
    </div>
  );
};
