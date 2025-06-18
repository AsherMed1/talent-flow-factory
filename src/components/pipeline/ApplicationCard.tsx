
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChevronDown, ChevronUp, Star, Calendar, FileText, Mic, Video, Phone, Mail } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { ExpandedContent } from './ExpandedContent';
import { ActionButtons } from './ActionButtons';
import { VoiceAnalysisSection } from './VoiceAnalysisSection';
import { PreScreeningAnalysisSection } from './PreScreeningAnalysisSection';

interface ApplicationCardProps {
  application: Application;
  onUpdateStatus: (applicationId: string, newStatus: Application['status']) => void;
  onUpdateRating: (applicationId: string, rating: number) => void;
  onUpdateNotes: (applicationId: string, notes: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const ApplicationCard = ({ 
  application, 
  onUpdateStatus, 
  onUpdateRating, 
  onUpdateNotes,
  isExpanded = false,
  onToggleExpand
}: ApplicationCardProps) => {
  const [showDetailedVoiceAnalysis, setShowDetailedVoiceAnalysis] = useState(false);
  
  const getStatusColor = (status: string) => {
    const colors = {
      'applied': 'bg-blue-100 text-blue-800',
      'reviewed': 'bg-purple-100 text-purple-800',
      'interview_scheduled': 'bg-yellow-100 text-yellow-800',
      'interview_completed': 'bg-orange-100 text-orange-800',
      'offer_sent': 'bg-green-100 text-green-800',
      'hired': 'bg-emerald-100 text-emerald-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-gray-400 text-sm">No rating</span>;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating}/5)</span>
      </div>
    );
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        {/* Main Content Row */}
        <div className="flex items-start justify-between">
          {/* Candidate Info */}
          <div className="flex items-center gap-4 flex-1">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                {application.candidates.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{application.candidates.name}</h3>
                <Badge className={getStatusColor(application.status)}>
                  {application.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{application.candidates.email}</span>
                </div>
                {application.candidates.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{application.candidates.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Applied: {new Date(application.applied_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Files & Rating */}
          <div className="flex items-center gap-6">
            {/* File indicators */}
            <div className="flex gap-2">
              {application.has_resume && (
                <div className="flex items-center gap-1 text-green-600">
                  <FileText className="w-4 h-4" />
                  <span className="text-xs">Resume</span>
                </div>
              )}
              {application.has_voice_recording && (
                <div className="flex items-center gap-1 text-blue-600">
                  <Mic className="w-4 h-4" />
                  <span className="text-xs">Voice</span>
                </div>
              )}
              {application.has_video && (
                <div className="flex items-center gap-1 text-purple-600">
                  <Video className="w-4 h-4" />
                  <span className="text-xs">Video</span>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="text-right">
              {renderStars(application.rating)}
            </div>

            {/* Expand/Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="ml-2"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Voice Analysis Section */}
        <VoiceAnalysisSection 
          application={application}
          showDetailedAnalysis={showDetailedVoiceAnalysis}
          onToggleDetailed={setShowDetailedVoiceAnalysis}
        />

        {/* Pre-screening Analysis Section */}
        <PreScreeningAnalysisSection 
          responses={application.pre_screening_responses || []} 
        />

        {/* Tags */}
        {application.candidates.candidate_tags && application.candidates.candidate_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t">
            {application.candidates.candidate_tags.map((tagObj, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tagObj.tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <ExpandedContent 
            application={application}
            onUpdateStatus={onUpdateStatus}
            onUpdateRating={onUpdateRating}
            onUpdateNotes={onUpdateNotes}
          />
        )}

        {/* Action Buttons */}
        <ActionButtons application={application} />
      </CardContent>
    </Card>
  );
};
