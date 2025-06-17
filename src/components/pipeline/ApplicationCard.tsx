
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

interface ApplicationCardProps {
  application: Application;
  stageIndex: number;
}

export const ApplicationCard = ({ application, stageIndex }: ApplicationCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);

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

  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-4">
        <ApplicationHeader application={application} />
        
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

        <VoiceAnalysisSection 
          application={application} 
          showDetailedAnalysis={showDetailedAnalysis} 
          onToggleDetailed={setShowDetailedAnalysis} 
        />
        
        <CandidateTagsSection application={application} />
        
        <ApplicationActions application={application} currentStageIndex={stageIndex} />
      </CardContent>
    </Card>
  );
};
