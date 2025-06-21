
import React from 'react';
import { Application } from '@/hooks/useApplications';
import { stages, ApplicationStatus } from './PipelineStages';
import { useIsMobile } from '@/hooks/useIsMobile';
import { SmartFilters, SmartFilterCriteria } from './SmartFilters';
import { useSmartFilters } from './useSmartFilters';
import { SkeletonCard, SkeletonRow } from '@/components/ui/skeleton-card';
import { useRealtimeApplications } from '@/hooks/useRealtimeApplications';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { KanbanStageHeader } from './KanbanStageHeader';
import { KanbanStageContent } from './KanbanStageContent';
import { KanbanMobileStage } from './KanbanMobileStage';
import { PipelineStatistics } from './PipelineStatistics';

interface KanbanBoardProps {
  applications: Application[];
  isLoading?: boolean;
}

export const KanbanBoard = ({ applications, isLoading = false }: KanbanBoardProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [processingApplications, setProcessingApplications] = React.useState<Set<string>>(new Set());
  const [smartFilters, setSmartFilters] = React.useState<SmartFilterCriteria>({
    minOverallScore: 6,
    minEnglishFluency: 7,
    minMotivation: 6,
    minClarity: 6,
    requireVoiceAnalysis: true,
    hideRejected: true,
    topPercentOnly: null,
  });

  // Enable real-time updates
  useRealtimeApplications();

  const { filteredApplications, statistics } = useSmartFilters(applications, smartFilters);

  const handleStatusUpdate = React.useCallback(async (applicationId: string, newStatus: ApplicationStatus) => {
    setProcessingApplications(prev => new Set(prev).add(applicationId));
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Application moved to ${newStatus.replace('_', ' ')}`,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Update Failed",
        description: "Could not update application status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setProcessingApplications(prev => {
          const newSet = new Set(prev);
          newSet.delete(applicationId);
          return newSet;
        });
      }, 1000);
    }
  }, [toast]);

  const { dragState, handleDragStart, handleDragEnd, handleDragOver, handleDrop } = useDragAndDrop(handleStatusUpdate);

  const getApplicationsByStage = React.useCallback((stageName: ApplicationStatus) => {
    return filteredApplications?.filter(app => 
      app.status === stageName && !processingApplications.has(app.id)
    ) || [];
  }, [filteredApplications, processingApplications]);

  const handleSwipeLeft = React.useCallback((application: Application) => {
    console.log('Swipe left - reject/move back:', application.candidate.name);
  }, []);

  const handleSwipeRight = React.useCallback((application: Application) => {
    console.log('Swipe right - approve/move forward:', application.candidate.name);
  }, []);

  // Memoize stage rendering to prevent unnecessary re-renders
  const stageComponents = React.useMemo(() => {
    return stages.map((stage, stageIndex) => {
      const stageApplications = getApplicationsByStage(stage.name);
      return { stage, stageIndex, stageApplications };
    });
  }, [stages, getApplicationsByStage]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Loading skeleton for pipeline */}
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className={`p-4 ${stage.color} border-b border-gray-200`}>
                <div className="h-6 w-48 bg-white/30 rounded animate-pulse" />
              </div>
              <div className="p-3">
                {isMobile ? (
                  <div className="space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : (
                  <div>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Smart Filters */}
      <SmartFilters
        onFiltersChange={setSmartFilters}
        applicantCount={applications?.length || 0}
        filteredCount={filteredApplications?.length || 0}
      />

      {/* Statistics Dashboard */}
      {statistics && <PipelineStatistics statistics={statistics} />}

      {/* Pipeline Stages */}
      {isMobile ? (
        <div className="space-y-4 pb-20">
          {stageComponents.map(({ stage, stageIndex, stageApplications }) => (
            <KanbanMobileStage
              key={stageIndex}
              stage={stage}
              applications={stageApplications}
              stageIndex={stageIndex}
              isDragging={dragState.isDragging}
              onStatusUpdate={handleStatusUpdate}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {stageComponents.map(({ stage, stageIndex, stageApplications }) => (
            <div 
              key={stageIndex} 
              className={`bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 ${
                dragState.isDragging ? 'border-dashed border-2 border-blue-400' : ''
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.name)}
            >
              <KanbanStageHeader
                stage={stage}
                applicationCount={stageApplications.length}
                isDragging={dragState.isDragging}
                draggedFromStage={dragState.draggedFromStage}
              />
              
              <KanbanStageContent
                applications={stageApplications}
                stage={stage}
                isDragging={dragState.isDragging}
                draggedFromStage={dragState.draggedFromStage}
                draggedApplication={dragState.draggedApplication}
                onStatusUpdate={handleStatusUpdate}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
