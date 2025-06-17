
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleVoicePlayback = () => {
    console.log('Playing voice recording for:', application.candidates.name);
    
    // Check if we have actual audio data in form_data
    if (application.form_data) {
      const formData = application.form_data as any;
      let audioUrl = null;
      
      // Try to find audio URL in various locations
      if (formData.voiceRecordings?.introductionRecording) {
        audioUrl = formData.voiceRecordings.introductionRecording;
      } else if (formData.voiceRecordings?.scriptRecording) {
        audioUrl = formData.voiceRecordings.scriptRecording;
      } else if (formData.introductionRecording) {
        audioUrl = formData.introductionRecording;
      } else if (formData.scriptRecording) {
        audioUrl = formData.scriptRecording;
      }
      
      if (audioUrl && !isPlaying) {
        // If we have a real audio URL, try to play it
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              console.log('Audio started playing');
            })
            .catch((error) => {
              console.error('Error playing audio:', error);
              // Fallback to demo mode
              setIsPlaying(true);
              setTimeout(() => setIsPlaying(false), 3000);
            });
          
          audioRef.current.onended = () => {
            setIsPlaying(false);
            console.log('Audio finished playing');
          };
        }
      } else if (isPlaying) {
        // Stop playback
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
      } else {
        // Demo mode - simulate playback
        setIsPlaying(true);
        setTimeout(() => {
          setIsPlaying(false);
        }, 3000);
      }
    } else {
      // Demo mode fallback
      if (!isPlaying) {
        setIsPlaying(true);
        setTimeout(() => {
          setIsPlaying(false);
        }, 3000);
      } else {
        setIsPlaying(false);
      }
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
          isPlaying={isPlaying} 
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
