
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Volume2 } from 'lucide-react';

interface VoiceAnalysisProps {
  voiceAnalysisScore: number | null;
  voiceClarityScore: number | null;
  voicePacingScore: number | null;
  voiceToneScore: number | null;
  voiceEnergyScore: number | null;
  voiceConfidenceScore: number | null;
  voiceAnalysisFeedback: string | null;
  voiceTranscription: string | null;
  voiceAnalysisCompletedAt: string | null;
  hasVoiceRecording: boolean;
}

export const VoiceAnalysisDisplay = ({
  voiceAnalysisScore,
  voiceClarityScore,
  voicePacingScore,
  voiceToneScore,
  voiceEnergyScore,
  voiceConfidenceScore,
  voiceAnalysisFeedback,
  voiceTranscription,
  voiceAnalysisCompletedAt,
  hasVoiceRecording,
}: VoiceAnalysisProps) => {
  if (!hasVoiceRecording) {
    return null;
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreBadge = (score: number | null, label: string) => {
    if (!score) return null;
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}:</span>
        <Badge variant="outline" className={getScoreColor(score)}>
          {score}/10
        </Badge>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Voice Analysis
          </CardTitle>
          {voiceAnalysisScore && (
            <Badge 
              variant="outline" 
              className={`text-lg px-3 py-1 ${getScoreColor(voiceAnalysisScore)}`}
            >
              Overall: {voiceAnalysisScore}/10
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {voiceAnalysisCompletedAt && (
          <div className="text-xs text-gray-500">
            Analyzed: {new Date(voiceAnalysisCompletedAt).toLocaleString()}
          </div>
        )}

        {/* Trait Scores */}
        {(voiceClarityScore || voicePacingScore || voiceToneScore || voiceEnergyScore || voiceConfidenceScore) && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Communication Traits</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {getScoreBadge(voiceClarityScore, 'Clarity')}
              {getScoreBadge(voicePacingScore, 'Pacing')}
              {getScoreBadge(voiceToneScore, 'Tone')}
              {getScoreBadge(voiceEnergyScore, 'Energy')}
              {getScoreBadge(voiceConfidenceScore, 'Confidence')}
            </div>
          </div>
        )}

        {/* AI Feedback */}
        {voiceAnalysisFeedback && (
          <div>
            <h4 className="font-semibold text-sm mb-2">AI Analysis</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {voiceAnalysisFeedback}
            </p>
          </div>
        )}

        {/* Transcription */}
        {voiceTranscription && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Transcription</h4>
            <div className="bg-gray-50 p-3 rounded-md text-sm">
              <p className="italic text-gray-700">"{voiceTranscription}"</p>
            </div>
          </div>
        )}

        {/* Play Audio Button */}
        <Button variant="outline" size="sm" className="w-full">
          <Play className="w-4 h-4 mr-2" />
          Play Audio Recording
        </Button>
      </CardContent>
    </Card>
  );
};
