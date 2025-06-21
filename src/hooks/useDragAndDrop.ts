
import React from 'react';
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus } from '@/components/pipeline/PipelineStages';
import { useToast } from '@/hooks/use-toast';

interface DragState {
  draggedApplication: Application | null;
  draggedFromStage: ApplicationStatus | null;
  isDragging: boolean;
}

export const useDragAndDrop = (onStatusUpdate: (applicationId: string, newStatus: ApplicationStatus) => void) => {
  // Safety check for React hooks availability
  if (!React || typeof React.useState !== 'function') {
    console.warn('React hooks not available in useDragAndDrop, returning fallback');
    const fallbackState = {
      draggedApplication: null,
      draggedFromStage: null,
      isDragging: false,
    };
    
    return {
      dragState: fallbackState,
      handleDragStart: () => {},
      handleDragEnd: () => {},
      handleDragOver: () => {},
      handleDrop: () => {},
    };
  }

  const [dragState, setDragState] = React.useState<DragState>({
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
      description: `${dragState.draggedApplication.candidate.name} moved to ${targetStage.replace('_', ' ')}`,
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
