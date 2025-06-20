import { Application } from '@/hooks/useApplications';
import { stages, ApplicationStatus } from './PipelineStages';
import { ApplicationRow } from './ApplicationRow';
import { MobileApplicationCard } from './MobileApplicationCard';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useState } from 'react';
import { SmartFilters, SmartFilterCriteria } from './SmartFilters';
import { useSmartFilters } from './useSmartFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Brain } from 'lucide-react';
import { SkeletonCard, SkeletonRow } from '@/components/ui/skeleton-card';
import { useRealtimeApplications } from '@/hooks/useRealtimeApplications';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KanbanBoardProps {
  applications: Application[];
  isLoading?: boolean;
}

export const KanbanBoard = ({ applications, isLoading = false }: KanbanBoardProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [processingApplications, setProcessingApplications] = useState<Set<string>>(new Set());
  const [smartFilters, setSmartFilters] = useState<SmartFilterCriteria>({
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

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
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
  };

  const { dragState, handleDragStart, handleDragEnd, handleDragOver, handleDrop } = useDragAndDrop(handleStatusUpdate);

  const getApplicationsByStage = (stageName: ApplicationStatus) => {
    return filteredApplications?.filter(app => 
      app.status === stageName && !processingApplications.has(app.id)
    ) || [];
  };

  const handleStatusChanged = (applicationId: string, newStatus: ApplicationStatus) => {
    handleStatusUpdate(applicationId, newStatus);
  };

  const handleSwipeLeft = (application: Application) => {
    console.log('Swipe left - reject/move back:', application.candidate.name);
  };

  const handleSwipeRight = (application: Application) => {
    console.log('Swipe right - approve/move forward:', application.candidate.name);
  };

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
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Total Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.total}</div>
              <p className="text-xs text-gray-600">All applicants</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                Analyzed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.analyzed}</div>
              <p className="text-xs text-gray-600">Voice analysis complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                High Scoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.highScoring}</div>
              <p className="text-xs text-gray-600">8+ overall score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                Filtered Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.filtered}</div>
              <p className="text-xs text-gray-600">Match your criteria</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pipeline Stages */}
      {isMobile ? (
        <div className="space-y-4 pb-20">
          {stages.map((stage, stageIndex) => {
            const stageApplications = getApplicationsByStage(stage.name);
            return (
              <div key={stageIndex} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {/* Enhanced Mobile Stage Header */}
                <div className={`p-4 ${stage.color} border-b border-gray-200`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {stage.displayName}
                    </h3>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-sm font-medium text-gray-800">
                        {stageApplications.length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Mobile Applications */}
                <div 
                  className="p-3"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.name)}
                >
                  {stageApplications.length > 0 ? (
                    <div className="space-y-3">
                      {stageApplications.map((application) => (
                        <div
                          key={application.id}
                          className="transform transition-all duration-200 hover:scale-[1.02] active:scale-95"
                          draggable
                          onDragStart={() => handleDragStart(application)}
                          onDragEnd={handleDragEnd}
                        >
                          <MobileApplicationCard 
                            application={application} 
                            stageIndex={stageIndex}
                            onSwipeLeft={() => handleSwipeLeft(application)}
                            onSwipeRight={() => handleSwipeRight(application)}
                            onStatusChanged={handleStatusChanged}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">No applications</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {dragState.isDragging ? 'Drop here to move application' : 'Applications will appear here when available'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          {stages.map((stage, stageIndex) => {
            const stageApplications = getApplicationsByStage(stage.name);
            return (
              <div 
                key={stageIndex} 
                className={`bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 ${
                  dragState.isDragging ? 'border-dashed border-2 border-blue-400' : ''
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.name)}
              >
                <div className={`p-4 ${stage.color} border-b border-gray-200`}>
                  <h3 className="font-semibold text-gray-900">
                    {stage.displayName} ({stageApplications.length})
                    {dragState.isDragging && dragState.draggedFromStage !== stage.name && (
                      <span className="ml-2 text-blue-600 text-sm">Drop to move here</span>
                    )}
                  </h3>
                </div>
                
                {stageApplications.length > 0 && (
                  <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
                    <div className="col-span-3">Candidate</div>
                    <div className="col-span-2">Applied</div>
                    <div className="col-span-3">Files & Audio</div>
                    <div className="col-span-2">Rating</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                )}
                
                <div>
                  {stageApplications.length > 0 ? (
                    stageApplications.map((application) => (
                      <div
                        key={application.id}
                        draggable
                        onDragStart={() => handleDragStart(application)}
                        onDragEnd={handleDragEnd}
                        className={`cursor-move transition-all duration-200 ${
                          dragState.draggedApplication?.id === application.id ? 'opacity-50' : ''
                        }`}
                      >
                        <ApplicationRow 
                          application={application} 
                          stageIndex={stageIndex}
                          onStatusChanged={handleStatusChanged}
                        />
                      </div>
                    ))
                  ) : (
                    <div className={`p-8 text-center text-gray-500 transition-all duration-200 ${
                      dragState.isDragging ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
                    }`}>
                      {dragState.isDragging && dragState.draggedFromStage !== stage.name ? (
                        <div>
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-blue-600">Drop application here</p>
                          <p className="text-xs text-blue-400 mt-1">Move to {stage.displayName}</p>
                        </div>
                      ) : (
                        <div>
                          No applications match your filters in this stage
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
