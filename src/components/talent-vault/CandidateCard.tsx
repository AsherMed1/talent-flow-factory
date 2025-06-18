
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { CandidateDeleteButton } from './CandidateDeleteButton';
import type { Candidate } from '@/hooks/useCandidates';
import { useState } from 'react';

interface CandidateCardProps {
  candidate: Candidate;
  onDelete: (candidateId: string, candidateName: string) => Promise<void>;
  deletingCandidateId: string | null;
}

export const CandidateCard = ({ candidate, onDelete, deletingCandidateId }: CandidateCardProps) => {
  const latestApplication = candidate.applications.length > 0 ? candidate.applications[0] : null;
  const tags = candidate.candidate_tags.map(tag => tag.tag);
  const [showScreeningDetails, setShowScreeningDetails] = useState(false);

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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

        {/* Pre-screening Analysis Section */}
        {latestApplication?.pre_screening_responses && latestApplication.pre_screening_responses.length > 0 && (
          <div className="border-t pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 p-0 h-auto font-medium text-gray-700"
              onClick={() => setShowScreeningDetails(!showScreeningDetails)}
            >
              Pre-screening Analysis
              {showScreeningDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
            
            {showScreeningDetails && (
              <div className="mt-3 space-y-3">
                {latestApplication.pre_screening_responses.map((response, index) => (
                  <div key={index} className="space-y-3">
                    {/* Overall Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Score:</span>
                      <Badge className={`${getScoreColor(response.overall_prescreening_score)} border-0`}>
                        {response.overall_prescreening_score}/100
                      </Badge>
                    </div>

                    {/* Individual Scores */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Motivation:</span>
                        <span className={`px-2 py-1 rounded ${getScoreColor(response.motivation_score)}`}>
                          {response.motivation_score}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experience:</span>
                        <span className={`px-2 py-1 rounded ${getScoreColor(response.experience_score)}`}>
                          {response.experience_score}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Availability:</span>
                        <span className={`px-2 py-1 rounded ${getScoreColor(response.availability_score)}`}>
                          {response.availability_score}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Communication:</span>
                        <span className={`px-2 py-1 rounded ${getScoreColor(response.communication_score)}`}>
                          {response.communication_score}
                        </span>
                      </div>
                    </div>

                    {/* Responses */}
                    <div className="space-y-2">
                      {response.motivation_response && (
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <div className="font-medium text-gray-700 mb-1">Motivation:</div>
                          <div className="text-gray-600">{response.motivation_response}</div>
                        </div>
                      )}
                      {response.experience_response && (
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <div className="font-medium text-gray-700 mb-1">Experience:</div>
                          <div className="text-gray-600">{response.experience_response}</div>
                        </div>
                      )}
                      {response.availability_response && (
                        <div className="bg-gray-50 p-2 rounded text-xs">
                          <div className="font-medium text-gray-700 mb-1">Availability:</div>
                          <div className="text-gray-600">{response.availability_response}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
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
