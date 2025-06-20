
import React, { memo, useCallback } from 'react';
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus } from '@/components/pipeline/PipelineStages';

interface OptimizedMobileApplicationCardProps {
  application: Application;
  stageIndex: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onStatusChanged: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export const OptimizedMobileApplicationCard = memo(({ 
  application,
  stageIndex,
  onSwipeLeft,
  onSwipeRight,
  onStatusChanged
}: OptimizedMobileApplicationCardProps) => {
  const handleStatusChange = useCallback((newStatus: ApplicationStatus) => {
    onStatusChanged(application.id, newStatus);
  }, [application.id, onStatusChanged]);

  const handleSwipeLeft = useCallback(() => {
    onSwipeLeft();
  }, [onSwipeLeft]);

  const handleSwipeRight = useCallback(() => {
    onSwipeRight();
  }, [onSwipeRight]);

  // Import and use the original MobileApplicationCard component
  const { MobileApplicationCard } = require('@/components/pipeline/MobileApplicationCard');
  
  return (
    <MobileApplicationCard 
      application={application}
      stageIndex={stageIndex}
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onStatusChanged={handleStatusChange}
    />
  );
});

OptimizedMobileApplicationCard.displayName = 'OptimizedMobileApplicationCard';
