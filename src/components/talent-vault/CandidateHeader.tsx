
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { CandidateDeleteButton } from './CandidateDeleteButton';
import type { Candidate } from '@/hooks/useCandidates';

interface CandidateHeaderProps {
  candidate: Candidate;
  latestApplication: Candidate['applications'][0] | null;
  onDelete: (candidateId: string, candidateName: string) => Promise<void>;
  deletingCandidateId: string | null;
}

export const CandidateHeader = ({ 
  candidate, 
  latestApplication, 
  onDelete, 
  deletingCandidateId 
}: CandidateHeaderProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interview_scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'offer_sent':
        return 'bg-green-100 text-green-800';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'applied':
        return 'Active Application';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'offer_sent':
        return 'Offer Sent';
      case 'hired':
        return 'Hired';
      default:
        return 'Previous Applicant';
    }
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback>
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">
            {candidate.name}
            <span className="text-xs text-gray-500 ml-2">ID: {candidate.id.slice(0, 8)}</span>
          </CardTitle>
          {latestApplication?.job_roles?.name && (
            <p className="text-sm text-gray-600">{latestApplication.job_roles.name}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {latestApplication && (
          <Badge className={getStatusColor(latestApplication.status)}>
            {getDisplayStatus(latestApplication.status)}
          </Badge>
        )}
        <CandidateDeleteButton
          candidate={candidate}
          onDelete={onDelete}
          isDeleting={deletingCandidateId === candidate.id}
        />
      </div>
    </div>
  );
};
