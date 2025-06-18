
import { useState } from 'react';
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus } from '@/components/pipeline/PipelineStages';
import { useToast } from '@/hooks/use-toast';

interface DragState {
  draggedApplication: Application | null;
  draggedFromStage: ApplicationStatus | null;
  isDragging: boolean;
}

export const useDragAndDrop = (onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus) => void) => {
  const [dragState, setDragState] = useState<DragState>({
    draggedApplication: null,
    draggedFromStage: null,
    isDragging: false,
  });
  const { toast } = useToast();

  const handleDragStart = (application: Application) => {
    setDragState({
      draggedApplication: application,
      draggedFromStage: application.status,
      isDragging: true,
    });
  };

  const handleDragEnd = () => {
    setDragState({
      draggedApplication: null,
      draggedFromStage: null,
      isDragging: false,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: ApplicationStatus) => {
    e.preventDefault();
    
    if (!dragState.draggedApplication || dragState.draggedFromStage === targetStage) {
      handleDragEnd();
      return;
    }

    // Update the application status
    onStatusUpdate(dragState.draggedApplication.id, targetStage);
    
    toast({
      title: "Application Moved",
      description: `${dragState.draggedApplication.candidates.name} moved to ${targetStage.replace('_', ' ')}`,
    });

    handleDragEnd();
  };

  return {
    dragState,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
  };
};
