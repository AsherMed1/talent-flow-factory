
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
import { PreScreeningAnalysisSection } from './PreScreeningAnalysisSection';
import { CandidateTagsSection } from './CandidateTagsSection';
import { RatingDisplay } from './RatingDisplay';
import { ApplicationStatus } from './PipelineStages';
import { useAudioHandler } from './AudioHandler';

interface ApplicationRowProps {
  application: Application;
  stageIndex: number;
  onStatusChanged?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export const ApplicationRow = ({ application, stageIndex, onStatusChanged }: ApplicationRowProps) => {
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { playingRecordingKey, audioRef, handleVoicePlayback } = useAudioHandler();

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
            <div className="text-xs text-gray-600 truncate">{application.candidates.email}</div>
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
            </div>
          )}

          {/* Pre-screening Analysis Score */}
          {application.pre_screening_responses && application.pre_screening_responses.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-600">Pre-screening</span>
              </div>
              <Badge className="text-xs bg-green-50 text-green-700 border-green-200">
                {application.pre_screening_responses[0].overall_prescreening_score}/100
              </Badge>
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

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t bg-gray-50 space-y-3">
          <VoiceAnalysisSection 
            application={application} 
            showDetailedAnalysis={showDetailedAnalysis} 
            onToggleDetailed={setShowDetailedAnalysis} 
          />
          
          <PreScreeningAnalysisSection 
            responses={application.pre_screening_responses || []} 
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
