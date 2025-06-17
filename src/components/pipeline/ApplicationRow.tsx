
import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Calendar, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Application } from '@/hooks/useApplications';
import { ApplicationActions } from './ApplicationActions';
import { DocumentsSection } from './DocumentsSection';
import { VoiceRecordingsSection } from './VoiceRecordingsSection';
import { VoiceAnalysisSection } from './VoiceAnalysisSection';
import { CandidateTagsSection } from './CandidateTagsSection';
import { RatingDisplay } from './RatingDisplay';

interface ApplicationRowProps {
  application: Application;
  stageIndex: number;
}

export const ApplicationRow = ({ application, stageIndex }: ApplicationRowProps) => {
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

  const handleDocumentView = (docType: string) => {
    console.log('Viewing document:', docType, 'for:', application.candidates.name);
    alert(`Opening ${docType} for ${application.candidates.name}`);
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Hidden audio element for actual playback */}
      <audio ref={audioRef} className="hidden" />
      
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-4 p-4 items-center">
        {/* Candidate Info - 3 columns */}
        <div className="col-span-3 flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs">
              {application.candidates.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm truncate">{application.candidates.name}</div>
            <div className="text-xs text-gray-500 truncate">
              {application.job_roles && application.job_roles.name ? application.job_roles.name : 'Unknown Role'}
            </div>
          </div>
        </div>

        {/* Applied Date - 2 columns */}
        <div className="col-span-2">
          <div className="text-sm">
            {new Date(application.applied_date).toLocaleDateString()}
          </div>
          {application.interview_date && (
            <div className="text-xs text-blue-600 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(application.interview_date).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Documents & Voice - 3 columns */}
        <div className="col-span-3">
          <DocumentsSection application={application} />
          <VoiceRecordingsSection 
            application={application} 
            isPlaying={isPlaying} 
            onVoicePlayback={handleVoicePlayback} 
          />
        </div>

        {/* Rating & Voice Score - 2 columns */}
        <div className="col-span-2">
          <RatingDisplay rating={application.rating} size="sm" showEmpty={false} />
          {application.voice_analysis_score && (
            <Badge variant="outline" className="text-xs mt-1">
              Voice: {application.voice_analysis_score}/10
            </Badge>
          )}
        </div>

        {/* Actions & Expand - 2 columns */}
        <div className="col-span-2 flex items-center justify-between">
          <ApplicationActions application={application} currentStageIndex={stageIndex} />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t bg-gray-50 space-y-3">
          <VoiceAnalysisSection 
            application={application} 
            showDetailedAnalysis={showDetailedAnalysis} 
            onToggleDetailed={setShowDetailedAnalysis} 
          />
          
          <CandidateTagsSection application={application} />
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>Email: {application.candidates.email}</div>
            {application.candidates.phone && (
              <div>Phone: {application.candidates.phone}</div>
            )}
            {application.notes && (
              <div className="bg-white p-2 rounded text-xs border">
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
    </div>
  );
};
