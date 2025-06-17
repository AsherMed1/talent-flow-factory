
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Volume2, ChevronRight } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { VoiceAnalysisDisplay } from '../VoiceAnalysisDisplay';

interface VoiceAnalysisSectionProps {
  application: Application;
  showDetailedAnalysis: boolean;
  onToggleDetailed: (show: boolean) => void;
}

export const VoiceAnalysisSection = ({ application, showDetailedAnalysis, onToggleDetailed }: VoiceAnalysisSectionProps) => {
  const getVoiceScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!application.has_voice_recording || !application.voice_analysis_score) return null;

  return (
    <div className="mb-3 p-3 bg-blue-50 rounded-md border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium flex items-center gap-1">
          <Volume2 className="w-3 h-3" />
          AI Voice Analysis
        </span>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`text-xs ${getVoiceScoreColor(application.voice_analysis_score)}`}
          >
            {application.voice_analysis_score}/10
          </Badge>
          <Dialog open={showDetailedAnalysis} onOpenChange={onToggleDetailed}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                <ChevronRight className="w-3 h-3" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detailed Voice Analysis - {application.candidates.name}</DialogTitle>
              </DialogHeader>
              <VoiceAnalysisDisplay
                voiceAnalysisScore={application.voice_analysis_score}
                voiceClarityScore={application.voice_clarity_score}
                voicePacingScore={application.voice_pacing_score}
                voiceToneScore={application.voice_tone_score}
                voiceEnergyScore={application.voice_energy_score}
                voiceConfidenceScore={application.voice_confidence_score}
                voiceAnalysisFeedback={application.voice_analysis_feedback}
                voiceTranscription={application.voice_transcription}
                voiceAnalysisCompletedAt={application.voice_analysis_completed_at}
                hasVoiceRecording={application.has_voice_recording}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Quick trait scores grid */}
      <div className="grid grid-cols-2 gap-1 text-xs mb-2">
        {application.voice_clarity_score && (
          <span className="flex justify-between">
            <span>Clarity:</span>
            <span className="font-medium">{application.voice_clarity_score}/10</span>
          </span>
        )}
        {application.voice_confidence_score && (
          <span className="flex justify-between">
            <span>Confidence:</span>
            <span className="font-medium">{application.voice_confidence_score}/10</span>
          </span>
        )}
        {application.voice_tone_score && (
          <span className="flex justify-between">
            <span>Tone:</span>
            <span className="font-medium">{application.voice_tone_score}/10</span>
          </span>
        )}
        {application.voice_energy_score && (
          <span className="flex justify-between">
            <span>Energy:</span>
            <span className="font-medium">{application.voice_energy_score}/10</span>
          </span>
        )}
      </div>
      
      {/* Brief feedback preview */}
      {application.voice_analysis_feedback && (
        <div className="text-xs text-gray-600 border-t pt-2">
          <p className="line-clamp-2">
            {application.voice_analysis_feedback.length > 100 
              ? `${application.voice_analysis_feedback.substring(0, 100)}...` 
              : application.voice_analysis_feedback}
          </p>
        </div>
      )}
    </div>
  );
};
