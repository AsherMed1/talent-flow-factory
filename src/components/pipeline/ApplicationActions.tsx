import { useState } from 'react';
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus, stages } from './PipelineStages';
import { useStatusUpdateHandler } from './StatusUpdateHandler';
import { useVoiceAnalysisHandler } from './VoiceAnalysisHandler';
import { ActionButtons } from './ActionButtons';

interface ApplicationActionsProps {
  application: Application;
  currentStageIndex: number;
  onStatusChanged?: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export const ApplicationActions = ({ application, currentStageIndex, onStatusChanged }: ApplicationActionsProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { handleStatusChange } = useStatusUpdateHandler();
  const { handleAnalyzeVoice } = useVoiceAnalysisHandler();

  const handleApprove = async () => {
    setIsUpdating(true);
    try {
      const nextStageIndex = currentStageIndex + 1;
      const newStatus = nextStageIndex < stages.length ? stages[nextStageIndex].name : 'hired';
      // Pass isApproveAction as true to trigger interview email
      await handleStatusChange(application.id, newStatus, application, onStatusChanged, true);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    setIsUpdating(true);
    try {
      // Pass isApproveAction as false for rejection
      await handleStatusChange(application.id, 'rejected', application, onStatusChanged, false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVoiceAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await handleAnalyzeVoice(application, false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVoiceReAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await handleAnalyzeVoice(application, true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasVoiceRecording = application.has_voice_recording || 
    application.form_data?.voiceRecordings?.hasIntroduction || 
    application.form_data?.voiceRecordings?.hasScript;

  const hasAnalysis = application.voice_analysis_score !== null;

  return (
    <ActionButtons
      onApprove={handleApprove}
      onReject={handleReject}
      onAnalyzeVoice={handleVoiceAnalysis}
      onReAnalyzeVoice={handleVoiceReAnalysis}
      isUpdating={isUpdating}
      isAnalyzing={isAnalyzing}
      hasVoiceRecording={hasVoiceRecording}
      hasAnalysis={hasAnalysis}
    />
  );
};
