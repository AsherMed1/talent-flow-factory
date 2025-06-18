
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Star } from 'lucide-react';
import { CandidateDeleteButton } from './CandidateDeleteButton';
import type { Candidate } from '@/hooks/useCandidates';

interface CandidateCardProps {
  candidate: Candidate;
  onDelete: (candidateId: string, candidateName: string) => Promise<void>;
  deletingCandidateId: string | null;
}

export const CandidateCard = ({ candidate, onDelete, deletingCandidateId }: CandidateCardProps) => {
  const latestApplication = candidate.applications.length > 0 ? candidate.applications[0] : null;
  const tags = candidate.candidate_tags.map(tag => tag.tag);

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }, (_, index) => (
          <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {halfStar && <Star className="w-4 h-4 fill-yellow-200 text-yellow-400" />}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

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
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
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
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          {latestApplication?.rating && renderStars(latestApplication.rating)}
          <div className="text-sm text-gray-500">
            {latestApplication && `Applied: ${new Date(latestApplication.applied_date).toLocaleDateString()}`}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{candidate.email}</span>
          </div>
          {candidate.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span>{candidate.phone}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        {latestApplication?.notes && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">{latestApplication.notes}</p>
            <div className="text-xs text-gray-500 mt-2">
              Last contact: {new Date(latestApplication.applied_date).toLocaleDateString()}
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline">View Profile</Button>
          <Button size="sm" variant="outline">Send Message</Button>
          <Button size="sm" variant="outline">Schedule Interview</Button>
        </div>
      </CardContent>
    </Card>
  );
};
