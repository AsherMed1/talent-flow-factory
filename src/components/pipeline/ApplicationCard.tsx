
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

interface ApplicationCardProps {
  application: Application;
  stageIndex: number;
}

export const ApplicationCard = ({ application, stageIndex }: ApplicationCardProps) => {
  const [playingRecordingKey, setPlayingRecordingKey] = useState<string | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleVoicePlayback = (recordingKey: string, recordingUrl?: string) => {
    console.log('handleVoicePlayback called with:', { recordingKey, recordingUrl });
    console.log('Current audio element:', audioRef.current);
    console.log('Playing voice recording:', recordingKey, 'for:', application.candidates.name);
    
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

    // Try to play the specific recording if we have a URL
    if (recordingUrl) {
      console.log('Attempting to play audio with URL:', recordingUrl);
      if (audioRef.current) {
        audioRef.current.src = recordingUrl;
        
        // Add load event listener to see if audio loads
        audioRef.current.onloadstart = () => console.log('Audio load started');
        audioRef.current.onloadeddata = () => console.log('Audio data loaded');
        audioRef.current.onerror = (e) => console.error('Audio error:', e);
        audioRef.current.oncanplay = () => console.log('Audio can play');
        
        audioRef.current.play()
          .then(() => {
            setPlayingRecordingKey(recordingKey);
            console.log('Audio started playing:', recordingKey);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            console.log('Audio element state:', {
              src: audioRef.current?.src,
              readyState: audioRef.current?.readyState,
              networkState: audioRef.current?.networkState,
              error: audioRef.current?.error
            });
            // Fallback to demo mode
            setPlayingRecordingKey(recordingKey);
            setTimeout(() => setPlayingRecordingKey(null), 3000);
          });
        
        audioRef.current.onended = () => {
          setPlayingRecordingKey(null);
          console.log('Audio finished playing:', recordingKey);
        };
      }
    } else {
      console.log('No URL provided, using demo mode');
      // Demo mode - simulate playback
      setPlayingRecordingKey(recordingKey);
      setTimeout(() => {
        setPlayingRecordingKey(null);
      }, 3000);
    }
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
        <audio ref={audioRef} className="hidden" />
        
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
