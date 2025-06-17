
import { Card, CardContent } from '@/components/ui/card';
import { Application } from '@/hooks/useApplications';
import { ApplicationActions } from './ApplicationActions';
import { ApplicationHeader } from './ApplicationHeader';
import { DocumentsSection } from './DocumentsSection';
import { VoiceRecordingsSection } from './VoiceRecordingsSection';
import { VoiceAnalysisSection } from './VoiceAnalysisSection';
import { CandidateTagsSection } from './CandidateTagsSection';
import { ApplicationDatesSection } from './ApplicationDatesSection';
import { RatingDisplay } from './RatingDisplay';
import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ApplicationCardProps {
  application: Application;
  stageIndex: number;
}

export const ApplicationCard = ({ application, stageIndex }: ApplicationCardProps) => {
  const [playingRecordingKey, setPlayingRecordingKey] = useState<string | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleVoicePlayback = (recordingKey: string, recordingUrl?: string) => {
    console.log('=== Audio Playback Debug ===');
    console.log('handleVoicePlayback called with:', { recordingKey, recordingUrl });
    
    // If the same recording is already playing, stop it
    if (playingRecordingKey === recordingKey) {
      console.log('Stopping currently playing recording');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingRecordingKey(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      console.log('Stopping previous audio');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Check if we have a valid URL and it's a blob URL
    if (recordingUrl && recordingUrl.startsWith('blob:')) {
      console.log('Detected blob URL - these typically don\'t work across page contexts');
      toast({
        title: "Audio Unavailable",
        description: "Voice recording is not accessible. Blob URLs expire when navigating between pages.",
        variant: "destructive",
      });
      return;
    }

    // Try to play the specific recording if we have a valid URL
    if (recordingUrl && !recordingUrl.startsWith('blob:')) {
      console.log('Attempting to play audio with URL:', recordingUrl);
      
      if (audioRef.current) {
        audioRef.current.onerror = (e) => {
          console.error('❌ Audio error:', e);
          toast({
            title: "Audio Error",
            description: "Could not play the voice recording.",
            variant: "destructive",
          });
          setPlayingRecordingKey(null);
        };
        
        audioRef.current.onended = () => {
          console.log('✓ Audio finished playing');
          setPlayingRecordingKey(null);
        };
        
        audioRef.current.src = recordingUrl;
        audioRef.current.play()
          .then(() => {
            console.log('✓ Audio playing successfully');
            setPlayingRecordingKey(recordingKey);
          })
          .catch((error) => {
            console.error('❌ Play failed:', error);
            toast({
              title: "Playback Failed",
              description: "Voice recording could not be played.",
              variant: "destructive",
            });
          });
      }
    } else {
      // No valid URL - show helpful message
      console.log('No valid audio URL available');
      toast({
        title: "Audio Not Available",
        description: "Voice recording was submitted but audio file is not accessible in this context.",
        variant: "destructive",
      });
    }
    console.log('=== End Audio Debug ===');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on buttons or badges
    if ((e.target as HTMLElement).closest('button, .cursor-pointer')) {
      return;
    }
    setIsExpanded(!isExpanded);
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
          <div className="mt-3 space-y-3 border-t pt-3">
            <VoiceAnalysisSection 
              application={application} 
              showDetailedAnalysis={showDetailedAnalysis} 
              onToggleDetailed={setShowDetailedAnalysis} 
            />
            
            <CandidateTagsSection application={application} />
            
            {/* Additional candidate info when expanded */}
            <div className="text-xs text-gray-600 space-y-1">
              <div>Email: {application.candidates.email}</div>
              {application.candidates.phone && (
                <div>Phone: {application.candidates.phone}</div>
              )}
              {application.notes && (
                <div className="bg-gray-50 p-2 rounded text-xs">
                  <strong>Notes:</strong> {application.notes}
                </div>
              )}
              
              {/* Show detailed rating if available */}
              {application.rating && (
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="font-medium">Rating:</span>
                  <RatingDisplay rating={application.rating} size="md" />
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t">
          <ApplicationActions application={application} currentStageIndex={stageIndex} />
        </div>
      </CardContent>
    </Card>
  );
};
