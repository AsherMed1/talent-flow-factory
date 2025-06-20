
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus } from './PipelineStages';
import { OptimizedApplicationRow } from '@/components/OptimizedApplicationRow';

interface KanbanStageContentProps {
  applications: Application[];
  stage: {
    name: ApplicationStatus;
    displayName: string;
  };
  isDragging: boolean;
  draggedFromStage?: ApplicationStatus;
  draggedApplication?: Application;
  onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus) => void;
  onDragStart: (application: Application) => void;
  onDragEnd: () => void;
}

export const KanbanStageContent = ({
  applications,
  stage,
  isDragging,
  draggedFromStage,
  draggedApplication,
  onStatusUpdate,
  onDragStart,
  onDragEnd
}: KanbanStageContentProps) => {
  if (applications.length === 0) {
    return (
      <div className={`p-8 text-center text-gray-500 transition-all duration-200 ${
        isDragging ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
      }`}>
        {isDragging && draggedFromStage !== stage.name ? (
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
          <div>No applications match your filters in this stage</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase tracking-wide">
        <div className="col-span-3">Candidate</div>
        <div className="col-span-2">Applied</div>
        <div className="col-span-3">Files & Audio</div>
        <div className="col-span-2">Rating</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      <div>
        {applications.map((application) => (
          <div
            key={application.id}
            draggable
            onDragStart={() => onDragStart(application)}
            onDragEnd={onDragEnd}
            className={`cursor-move transition-all duration-200 ${
              draggedApplication?.id === application.id ? 'opacity-50' : ''
            }`}
          >
            <OptimizedApplicationRow 
              application={application} 
              stageIndex={0}
              onStatusChanged={onStatusUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
