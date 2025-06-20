
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus } from './PipelineStages';
import { OptimizedMobileApplicationCard } from '@/components/OptimizedMobileApplicationCard';

interface KanbanMobileStageProps {
  stage: {
    name: ApplicationStatus;
    displayName: string;
    color: string;
  };
  applications: Application[];
  stageIndex: number;
  isDragging: boolean;
  onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus) => void;
  onSwipeLeft: (application: Application) => void;
  onSwipeRight: (application: Application) => void;
  onDragStart: (application: Application) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, stageName: ApplicationStatus) => void;
}

export const KanbanMobileStage = ({
  stage,
  applications,
  stageIndex,
  isDragging,
  onStatusUpdate,
  onSwipeLeft,
  onSwipeRight,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}: KanbanMobileStageProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className={`p-4 ${stage.color} border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-base">
            {stage.displayName}
          </h3>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm font-medium text-gray-800">
              {applications.length}
            </span>
          </div>
        </div>
      </div>
      
      <div 
        className="p-3"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, stage.name)}
      >
        {applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((application) => (
              <div
                key={application.id}
                className="transform transition-all duration-200 hover:scale-[1.02] active:scale-95"
                draggable
                onDragStart={() => onDragStart(application)}
                onDragEnd={onDragEnd}
              >
                <OptimizedMobileApplicationCard 
                  application={application} 
                  stageIndex={stageIndex}
                  onSwipeLeft={() => onSwipeLeft(application)}
                  onSwipeRight={() => onSwipeRight(application)}
                  onStatusChanged={onStatusUpdate}
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
              {isDragging ? 'Drop here to move application' : 'Applications will appear here when available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
