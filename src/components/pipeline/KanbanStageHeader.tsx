
import { Card } from '@/components/ui/card';
import { ApplicationStatus } from './PipelineStages';

interface KanbanStageHeaderProps {
  stage: {
    name: ApplicationStatus;
    displayName: string;
    color: string;
  };
  applicationCount: number;
  isDragging: boolean;
  draggedFromStage?: ApplicationStatus;
}

export const KanbanStageHeader = ({ 
  stage, 
  applicationCount, 
  isDragging, 
  draggedFromStage 
}: KanbanStageHeaderProps) => {
  return (
    <div className={`p-4 ${stage.color} border-b border-gray-200`}>
      <h3 className="font-semibold text-gray-900">
        {stage.displayName} ({applicationCount})
        {isDragging && draggedFromStage !== stage.name && (
          <span className="ml-2 text-blue-600 text-sm">Drop to move here</span>
        )}
      </h3>
    </div>
  );
};
