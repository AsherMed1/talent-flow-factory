
import React, { memo, useCallback } from 'react';
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus } from '@/components/pipeline/PipelineStages';

interface OptimizedApplicationRowProps {
  application: Application;
  stageIndex: number;
  onStatusChanged: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export const OptimizedApplicationRow = memo(({ 
  application, 
  stageIndex, 
  onStatusChanged 
}: OptimizedApplicationRowProps) => {
  const handleStatusChange = useCallback((newStatus: ApplicationStatus) => {
    onStatusChanged(application.id, newStatus);
  }, [application.id, onStatusChanged]);

  // Import and use the original ApplicationRow component
  // This is a wrapper that adds memoization
  const { ApplicationRow } = require('@/components/pipeline/ApplicationRow');
  
  return (
    <ApplicationRow 
      application={application}
      stageIndex={stageIndex}
      onStatusChanged={handleStatusChange}
    />
  );
});

OptimizedApplicationRow.displayName = 'OptimizedApplicationRow';
