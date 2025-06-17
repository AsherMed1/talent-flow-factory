
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
    console.log('=== Audio Playback Debug ===');
    console.log('handleVoicePlayback called with:', { recordingKey, recordingUrl });
    console.log('Current audio element:', audioRef.current);
    console.log('Current playing key:', playingRecordingKey);
    
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
      console.log('URL type:', typeof recordingUrl);
      console.log('URL starts with blob:', recordingUrl.startsWith('blob:'));
      
      if (audioRef.current) {
        // Clear previous event listeners
        audioRef.current.onloadstart = null;
        audioRef.current.onloadeddata = null;
        audioRef.current.onerror = null;
        audioRef.current.oncanplay = null;
        audioRef.current.onended = null;
        
        // Set up comprehensive event listeners
        audioRef.current.onloadstart = () => {
          console.log('✓ Audio load started');
        };
        
        audioRef.current.onloadedmetadata = () => {
          console.log('✓ Audio metadata loaded, duration:', audioRef.current?.duration);
        };
        
        audioRef.current.onloadeddata = () => {
          console.log('✓ Audio data loaded');
        };
        
        audioRef.current.oncanplay = () => {
          console.log('✓ Audio can play');
        };
        
        audioRef.current.oncanplaythrough = () => {
          console.log('✓ Audio can play through');
        };
        
        audioRef.current.onerror = (e) => {
          console.error('❌ Audio error event:', e);
          console.error('Audio error details:', {
            error: audioRef.current?.error,
            code: audioRef.current?.error?.code,
            message: audioRef.current?.error?.message
          });
          setPlayingRecordingKey(null);
        };
        
        audioRef.current.onplay = () => {
          console.log('✓ Audio started playing');
        };
        
        audioRef.current.onpause = () => {
          console.log('Audio paused');
        };
        
        audioRef.current.onended = () => {
          console.log('✓ Audio finished playing');
          setPlayingRecordingKey(null);
        };
        
        // Set the source
        audioRef.current.src = recordingUrl;
        
        // Attempt to load and play
        audioRef.current.load();
        
        console.log('Audio element state before play:', {
          src: audioRef.current.src,
          readyState: audioRef.current.readyState,
          networkState: audioRef.current.networkState,
          paused: audioRef.current.paused,
          muted: audioRef.current.muted,
          volume: audioRef.current.volume
        });
        
        audioRef.current.play()
          .then(() => {
            console.log('✓ Play promise resolved successfully');
            setPlayingRecordingKey(recordingKey);
          })
          .catch((error) => {
            console.error('❌ Play promise rejected:', error);
            console.log('Error details:', {
              name: error.name,
              message: error.message,
              code: error.code
            });
            console.log('Audio element final state:', {
              src: audioRef.current?.src,
              readyState: audioRef.current?.readyState,
              networkState: audioRef.current?.networkState,
              error: audioRef.current?.error,
              paused: audioRef.current?.paused,
              currentTime: audioRef.current?.currentTime,
              duration: audioRef.current?.duration
            });
            
            // Check if it's a blob URL issue
            if (recordingUrl.startsWith('blob:')) {
              console.log('❌ Blob URL may have expired or be invalid');
            }
            
            // Fallback to demo mode
            console.log('Falling back to demo mode');
            setPlayingRecordingKey(recordingKey);
            setTimeout(() => setPlayingRecordingKey(null), 3000);
          });
      }
    } else {
      console.log('No URL provided, using demo mode');
      // Demo mode - simulate playback
      setPlayingRecordingKey(recordingKey);
      setTimeout(() => {
        setPlayingRecordingKey(null);
      }, 3000);
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
