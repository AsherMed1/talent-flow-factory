
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Candidate } from '@/hooks/useCandidates';
import { CandidateHeader } from './CandidateHeader';
import { CandidateContactInfo } from './CandidateContactInfo';
import { CandidateRating } from './CandidateRating';
import { CandidateActions } from './CandidateActions';
import { PreScreeningAnalysis } from './PreScreeningAnalysis';
import { CandidateScoring } from './CandidateScoring';

interface CandidateCardProps {
  candidate: Candidate;
  onDelete: (candidateId: string, candidateName: string) => Promise<void>;
  deletingCandidateId: string | null;
}

export const CandidateCard = ({ candidate, onDelete, deletingCandidateId }: CandidateCardProps) => {
  const latestApplication = candidate.applications.length > 0 ? candidate.applications[0] : null;
  const tags = candidate.candidate_tags.map(tag => tag.tag);

  return (
    <Card className="hover:shadow-lg transition-shadow relative">
      <CardHeader className="pb-3">
        <CandidateHeader
          candidate={candidate}
          latestApplication={latestApplication}
          onDelete={onDelete}
          deletingCandidateId={deletingCandidateId}
        />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Enhanced scoring section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-4">
            <CandidateRating 
              rating={latestApplication?.rating} 
              appliedDate={latestApplication?.applied_date}
            />
            
            <CandidateContactInfo 
              email={candidate.email} 
              phone={candidate.phone} 
            />
            
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <CandidateScoring candidate={candidate} />
        </div>

        <PreScreeningAnalysis 
          responses={latestApplication?.pre_screening_responses || []} 
        />
        
        {latestApplication?.notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">{latestApplication.notes}</p>
            <div className="text-xs text-gray-500 mt-2">
              Last contact: {new Date(latestApplication.applied_date).toLocaleDateString()}
            </div>
          </div>
        )}
        
        <CandidateActions />
      </CardContent>
    </Card>
  );
};
