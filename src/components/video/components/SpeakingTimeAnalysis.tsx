
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';
import { VideoAnalysisResults } from '../types/VideoAnalysisTypes';

interface SpeakingTimeAnalysisProps {
  results: VideoAnalysisResults;
}

export const SpeakingTimeAnalysis = ({ results }: SpeakingTimeAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Speaking Time Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Interviewer</span>
              <span className="text-sm text-gray-600">{results.speakingTimeRatio.interviewer}%</span>
            </div>
            <Progress value={results.speakingTimeRatio.interviewer} className="h-2" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Candidate</span>
              <span className="text-sm text-gray-600">{results.speakingTimeRatio.candidate}%</span>
            </div>
            <Progress value={results.speakingTimeRatio.candidate} className="h-2" />
          </div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            {results.speakingTimeRatio.candidate > 60 
              ? "Good: Candidate had ample time to express themselves."
              : results.speakingTimeRatio.candidate < 30
              ? "Concern: Candidate spoke very little. Consider if they were given enough opportunity."
              : "Balanced: Good speaking time distribution."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
