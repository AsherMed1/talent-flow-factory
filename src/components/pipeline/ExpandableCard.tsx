
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { ApplicationHeader } from './ApplicationHeader';
import { ApplicationDatesSection } from './ApplicationDatesSection';
import { DocumentsSection } from './DocumentsSection';
import { VoiceRecordingsSection } from './VoiceRecordingsSection';
import { ApplicationActions } from './ApplicationActions';
import { ExpandedContent } from './ExpandedContent';
import { useAudioHandler } from './AudioHandler';

interface ExpandableCardProps {
  application: Application;
  stageIndex: number;
}

export const ExpandableCard = ({ application, stageIndex }: ExpandableCardProps) => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { playingRecordingKey, audioRef, handleVoicePlayback } = useAudioHandler();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on buttons or badges
    if ((e.target as HTMLElement).closest('button, .cursor-pointer')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  // Placeholder functions for the required props - these would normally come from a parent component
  const handleUpdateStatus = (applicationId: string, newStatus: Application['status']) => {
    console.log('Update status:', applicationId, newStatus);
    // This would normally update the application status in the database
  };

  const handleUpdateRating = (applicationId: string, rating: number) => {
    console.log('Update rating:', applicationId, rating);
    // This would normally update the application rating in the database
  };

  const handleUpdateNotes = (applicationId: string, notes: string) => {
    console.log('Update notes:', applicationId, notes);
    // This would normally update the application notes in the database
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-4">
        {/* Hidden audio element for actual playback */}
        <audio 
          ref={audioRef} 
          className="hidden"
          preload="none"
          controls={false}
        />
        
        <div className="flex items-center justify-between mb-2">
          <ApplicationHeader application={application} />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <ApplicationDatesSection application={application} />
        
        <DocumentsSection application={application} />

        <VoiceRecordingsSection 
          application={application} 
          playingRecordingKey={playingRecordingKey} 
          onVoicePlayback={handleVoicePlayback} 
        />

        {isExpanded && (
          <ExpandedContent 
            application={application}
            onUpdateStatus={handleUpdateStatus}
            onUpdateRating={handleUpdateRating}
            onUpdateNotes={handleUpdateNotes}
          />
        )}
        
        <div className="mt-3 pt-3 border-t">
          <ApplicationActions application={application} currentStageIndex={stageIndex} />
        </div>
      </CardContent>
    </Card>
  );
};
