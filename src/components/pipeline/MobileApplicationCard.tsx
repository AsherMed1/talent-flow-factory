
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { ApplicationActions } from './ApplicationActions';
import { RatingDisplay } from './RatingDisplay';
import { VoiceRecordingsSection } from './VoiceRecordingsSection';
import { DocumentsSection } from './DocumentsSection';
import { VoiceAnalysisSection } from './VoiceAnalysisSection';
import { ApplicationStatus } from './PipelineStages';

interface MobileApplicationCardProps {
  application: Application;
  stageIndex: number;
  onSwipeLeft: (application: Application) => void;
  onSwipeRight: (application: Application) => void;
  onStatusChanged?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export const MobileApplicationCard = ({ application, stageIndex, onSwipeLeft, onSwipeRight, onStatusChanged }: MobileApplicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playingRecordingKey, setPlayingRecordingKey] = useState<string | null>(null);

  const handleVoicePlayback = (recordingKey: string, recordingUrl?: string) => {
    console.log('Playing voice recording:', recordingKey, 'for:', application.candidates.name);
    
    if (playingRecordingKey === recordingKey) {
      setPlayingRecordingKey(null);
      return;
    }

    setPlayingRecordingKey(recordingKey);
    
    // Demo mode - simulate playback
    setTimeout(() => {
      setPlayingRecordingKey(null);
    }, 3000);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center">
            <h4 className="text-sm font-semibold">
              {application.candidates.name}
            </h4>
          </div>
          <p className="text-xs text-gray-500">
            Applied: {new Date(application.applied_date).toLocaleDateString()}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="py-2 space-y-2">
        {isExpanded && (
          <>
            <VoiceRecordingsSection 
              application={application}
              playingRecordingKey={playingRecordingKey}
              onVoicePlayback={handleVoicePlayback}
            />
            <DocumentsSection application={application} />
            <VoiceAnalysisSection 
              application={application}
              showDetailedAnalysis={false}
              onToggleDetailed={() => {}}
            />
            <RatingDisplay rating={application.rating} />
          </>
        )}
        <div className="flex items-center justify-between">
          <ApplicationActions 
            application={application} 
            currentStageIndex={stageIndex}
            onStatusChanged={onStatusChanged}
          />
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
            {application.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
