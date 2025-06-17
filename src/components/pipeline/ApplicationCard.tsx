
import { Card, CardContent } from '@/components/ui/card';
import { Application } from '@/hooks/useApplications';
import { ApplicationActions } from './ApplicationActions';
import { ApplicationHeader } from './ApplicationHeader';
import { DocumentsSection } from './DocumentsSection';
import { VoiceRecordingsSection } from './VoiceRecordingsSection';
import { VoiceAnalysisSection } from './VoiceAnalysisSection';
import { CandidateTagsSection } from './CandidateTagsSection';
import { ApplicationDatesSection } from './ApplicationDatesSection';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApplicationCardProps {
  application: Application;
  stageIndex: number;
}

export const ApplicationCard = ({ application, stageIndex }: ApplicationCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVoicePlayback = () => {
    console.log('Playing voice recording for:', application.candidates.name);
    
    // For demo purposes, we'll simulate audio playback
    // In a real implementation, you would fetch the actual audio file
    if (!isPlaying) {
      setIsPlaying(true);
      // Simulate audio duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } else {
      setIsPlaying(false);
    }
  };

  const handleDocumentView = (docType: string) => {
    console.log('Viewing document:', docType, 'for:', application.candidates.name);
    // In a real implementation, this would open the document
    // For now, we'll just show an alert
    alert(`Opening ${docType} for ${application.candidates.name}`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on buttons or badges
    if ((e.target as HTMLElement).closest('button, .cursor-pointer')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-white cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <ApplicationHeader application={application} />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <ApplicationDatesSection application={application} />
        
        <DocumentsSection 
          application={application} 
          onDocumentView={handleDocumentView} 
        />

        <VoiceRecordingsSection 
          application={application} 
          isPlaying={isPlaying} 
          onVoicePlayback={handleVoicePlayback} 
        />

        {isExpanded && (
          <div className="mt-3 space-y-3 border-t pt-3">
            <VoiceAnalysisSection 
              application={application} 
              showDetailedAnalysis={showDetailedAnalysis} 
              onToggleDetailed={setShowDetailedAnalysis} 
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
            </div>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t">
          <ApplicationActions application={application} currentStageIndex={stageIndex} />
        </div>
      </CardContent>
    </Card>
  );
};
