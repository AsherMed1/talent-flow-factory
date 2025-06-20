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
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar className="w-12 h-12 flex-shrink-0">
          <AvatarFallback>
            {candidate.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="text-lg truncate">
            {candidate.name}
          </CardTitle>
          <div className="text-xs text-gray-500 truncate">
            ID: {candidate.id.slice(0, 8)}
          </div>
          {latestApplication?.job_role?.name && (
            <p className="text-sm text-gray-600 truncate">{latestApplication.job_role.name}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {latestApplication && (
          <Badge className={`${getStatusColor(latestApplication.status)} text-xs whitespace-nowrap`}>
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
