import { useState, useRef } from 'react';
import { ChevronDown, ChevronUp, Calendar, Star, Brain } from 'lucide-react';
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
  onStatusChanged?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export const ApplicationRow = ({ application, stageIndex, onStatusChanged }: ApplicationRowProps) => {
  const [playingRecordingKey, setPlayingRecordingKey] = useState<string | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleVoicePlayback = (recordingKey: string, recordingUrl?: string) => {
    console.log('Playing voice recording:', recordingKey, 'for:', application.candidates.name);
    
    // If the same recording is already playing, stop it
    if (playingRecordingKey === recordingKey) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingRecordingKey(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Try to play the specific recording if we have a URL
    if (recordingUrl) {
      if (audioRef.current) {
        audioRef.current.src = recordingUrl;
        audioRef.current.play()
          .then(() => {
            setPlayingRecordingKey(recordingKey);
            console.log('Audio started playing:', recordingKey);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
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
      // Demo mode - simulate playback
      setPlayingRecordingKey(recordingKey);
      setTimeout(() => {
        setPlayingRecordingKey(null);
      }, 3000);
    }
  };

  const handleDocumentView = (docType: string) => {
    console.log('Viewing document:', docType, 'for:', application.candidates.name);
    alert(`Opening ${docType} for ${application.candidates.name}`);
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderVoiceAnalysisStars = (score: number | null) => {
    if (!score) return null;
    
    const fullStars = Math.floor(score / 2); // Convert 10-point scale to 5-star
    const hasHalfStar = (score % 2) !== 0;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          if (index < fullStars) {
            return <Star key={index} className="w-3 h-3 fill-yellow-400 text-yellow-400" />;
          } else if (index === fullStars && hasHalfStar) {
            return <Star key={index} className="w-3 h-3 fill-yellow-200 text-yellow-400" />;
          } else {
            return <Star key={index} className="w-3 h-3 text-gray-300" />;
          }
        })}
        <span className={`text-xs ml-1 ${getScoreColor(score)}`}>
          {score}/10
        </span>
      </div>
    );
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
            playingRecordingKey={playingRecordingKey} 
            onVoicePlayback={handleVoicePlayback} 
          />
        </div>

        {/* Rating & AI Analysis - 2 columns */}
        <div className="col-span-2 space-y-2">
          {/* Manual Rating */}
          <RatingDisplay rating={application.rating} size="sm" showEmpty={false} />
          
          {/* AI Voice Analysis */}
          {application.voice_analysis_score && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-600">AI Analysis</span>
              </div>
              {renderVoiceAnalysisStars(application.voice_analysis_score)}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-2 text-xs text-purple-600 hover:text-purple-700"
                onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
              >
                {showDetailedAnalysis ? 'Hide Details' : 'View Details'}
              </Button>
            </div>
          )}
        </div>

        {/* Actions & Expand - 2 columns */}
        <div className="col-span-2 flex items-center justify-between">
          <ApplicationActions 
            application={application} 
            currentStageIndex={stageIndex} 
            onStatusChanged={onStatusChanged}
          />
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

      {/* Detailed AI Analysis (when clicked) */}
      {showDetailedAnalysis && application.voice_analysis_score && (
        <div className="px-4 pb-4 bg-purple-50 border-t border-purple-100">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <h4 className="font-semibold text-sm text-purple-900">AI Voice Analysis Details</h4>
            </div>
            
            {/* Individual Trait Scores */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {application.voice_clarity_score && (
                <div className="flex justify-between">
                  <span>Clarity:</span>
                  <Badge variant="outline" className={getScoreColor(application.voice_clarity_score)}>
                    {application.voice_clarity_score}/10
                  </Badge>
                </div>
              )}
              {application.voice_pacing_score && (
                <div className="flex justify-between">
                  <span>Pacing:</span>
                  <Badge variant="outline" className={getScoreColor(application.voice_pacing_score)}>
                    {application.voice_pacing_score}/10
                  </Badge>
                </div>
              )}
              {application.voice_tone_score && (
                <div className="flex justify-between">
                  <span>Tone:</span>
                  <Badge variant="outline" className={getScoreColor(application.voice_tone_score)}>
                    {application.voice_tone_score}/10
                  </Badge>
                </div>
              )}
              {application.voice_energy_score && (
                <div className="flex justify-between">
                  <span>Energy:</span>
                  <Badge variant="outline" className={getScoreColor(application.voice_energy_score)}>
                    {application.voice_energy_score}/10
                  </Badge>
                </div>
              )}
              {application.voice_confidence_score && (
                <div className="flex justify-between">
                  <span>Confidence:</span>
                  <Badge variant="outline" className={getScoreColor(application.voice_confidence_score)}>
                    {application.voice_confidence_score}/10
                  </Badge>
                </div>
              )}
            </div>

            {/* AI Feedback */}
            {application.voice_analysis_feedback && (
              <div className="bg-white p-3 rounded-md">
                <h5 className="font-medium text-xs text-gray-900 mb-1">AI Feedback:</h5>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {application.voice_analysis_feedback}
                </p>
              </div>
            )}

            {/* Analysis Date */}
            {application.voice_analysis_completed_at && (
              <div className="text-xs text-gray-500">
                Analyzed: {new Date(application.voice_analysis_completed_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t bg-gray-50 space-y-3">
          <VoiceAnalysisSection 
            application={application} 
            showDetailedAnalysis={false} 
            onToggleDetailed={() => {}} 
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
