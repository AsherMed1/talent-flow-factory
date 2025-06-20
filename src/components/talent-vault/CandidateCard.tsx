
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Candidate } from '@/hooks/useCandidates';
import { CandidateHeader } from './CandidateHeader';
import { CandidateContactInfo } from './CandidateContactInfo';
import { CandidateRating } from './CandidateRating';
import { CandidateActions } from './CandidateActions';
import { PreScreeningAnalysis } from './PreScreeningAnalysis';
import { CandidateScoring } from './CandidateScoring';
import { CollaborationPanel } from '../collaboration/CollaborationPanel';
import { Users, MessageSquare, Star, User } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  onDelete: (candidateId: string, candidateName: string) => Promise<void>;
  deletingCandidateId: string | null;
}

export const CandidateCard = ({ candidate, onDelete, deletingCandidateId }: CandidateCardProps) => {
  const latestApplication = candidate.applications.length > 0 ? candidate.applications[0] : null;
  const tags = candidate.candidate_tags.map(tag => tag.tag);

  return (
    <Card className="hover:shadow-lg transition-shadow relative h-fit">
      <CardHeader className="pb-3">
        <CandidateHeader
          candidate={candidate}
          latestApplication={latestApplication}
          onDelete={onDelete}
          deletingCandidateId={deletingCandidateId}
        />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="scoring" className="flex items-center gap-1 text-xs">
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Scoring</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-1 text-xs">
              <Users className="w-3 h-3" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-1 text-xs">
              <MessageSquare className="w-3 h-3" />
              <span className="hidden sm:inline">Notes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
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
                    <Badge key={index} variant="outline" className="text-xs break-words">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <PreScreeningAnalysis 
              responses={latestApplication?.pre_screening_responses || []} 
            />
            
            {latestApplication?.notes && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 break-words whitespace-pre-wrap">{latestApplication.notes}</p>
                <div className="text-xs text-gray-500 mt-2">
                  Last contact: {new Date(latestApplication.applied_date).toLocaleDateString()}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scoring">
            <CandidateScoring candidate={candidate} />
          </TabsContent>

          <TabsContent value="assignments">
            <CollaborationPanel candidateId={candidate.id} />
          </TabsContent>

          <TabsContent value="notes">
            <CollaborationPanel candidateId={candidate.id} />
          </TabsContent>
        </Tabs>
        
        <CandidateActions />
      </CardContent>
    </Card>
  );
};
