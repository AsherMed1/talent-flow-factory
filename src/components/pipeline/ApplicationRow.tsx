
import { useState } from 'react';
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

interface ApplicationRowProps {
  application: Application;
  stageIndex: number;
}

export const ApplicationRow = ({ application, stageIndex }: ApplicationRowProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVoicePlayback = () => {
    console.log('Playing voice recording for:', application.candidates.name);
    
    if (!isPlaying) {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } else {
      setIsPlaying(false);
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
          <DocumentsSection 
            application={application} 
            onDocumentView={handleDocumentView} 
          />
          <VoiceRecordingsSection 
            application={application} 
            isPlaying={isPlaying} 
            onVoicePlayback={handleVoicePlayback} 
          />
        </div>

        {/* Rating - 2 columns */}
        <div className="col-span-2">
          {application.rating && (
            <div className="flex gap-1">
              {renderStars(application.rating)}
            </div>
          )}
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
          </div>
        </div>
      )}
    </div>
  );
};
