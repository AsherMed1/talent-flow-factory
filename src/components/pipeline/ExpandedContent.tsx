
import { Application } from '@/hooks/useApplications';
import { VoiceAnalysisSection } from './VoiceAnalysisSection';
import { CandidateTagsSection } from './CandidateTagsSection';
import { RatingDisplay } from './RatingDisplay';

interface ExpandedContentProps {
  application: Application;
  showDetailedAnalysis: boolean;
  onToggleDetailed: (show: boolean) => void;
}

export const ExpandedContent = ({ 
  application, 
  showDetailedAnalysis, 
  onToggleDetailed 
}: ExpandedContentProps) => {
  return (
    <div className="mt-3 space-y-3 border-t pt-3">
      <VoiceAnalysisSection 
        application={application} 
        showDetailedAnalysis={showDetailedAnalysis} 
        onToggleDetailed={onToggleDetailed} 
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
  );
};
