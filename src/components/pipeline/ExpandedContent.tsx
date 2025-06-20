
import { Application } from '@/hooks/useApplications';
import { VoiceAnalysisSection } from './VoiceAnalysisSection';
import { CandidateTagsSection } from './CandidateTagsSection';
import { RatingDisplay } from './RatingDisplay';

interface ExpandedContentProps {
  application: Application;
  onUpdateStatus: (applicationId: string, newStatus: Application['status']) => void;
  onUpdateRating: (applicationId: string, rating: number) => void;
  onUpdateNotes: (applicationId: string, notes: string) => void;
}

export const ExpandedContent = ({ 
  application, 
  onUpdateStatus, 
  onUpdateRating, 
  onUpdateNotes 
}: ExpandedContentProps) => {
  return (
    <div className="mt-3 space-y-3 border-t pt-3">
      {/* Additional candidate info when expanded */}
      <div className="text-xs text-gray-600 space-y-1">
        <div>Email: {application.candidate.email}</div>
        {application.candidate.phone && (
          <div>Phone: {application.candidate.phone}</div>
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
