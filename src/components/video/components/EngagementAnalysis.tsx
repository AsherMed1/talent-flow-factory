
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';
import { VideoAnalysisResults } from '../types/VideoAnalysisTypes';
import { getEngagementLevel } from '../utils/videoAnalysisUtils';

interface EngagementAnalysisProps {
  results: VideoAnalysisResults;
}

export const EngagementAnalysis = ({ results }: EngagementAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Candidate Engagement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Engagement Level</span>
          <div className="flex items-center gap-2">
            <Progress value={results.engagementLevel} className="w-24 h-2" />
            <span className={`text-sm font-medium ${getEngagementLevel(results.engagementLevel).color}`}>
              {getEngagementLevel(results.engagementLevel).label}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          {results.engagementLevel}% engagement based on vocal patterns, response timing, and interaction quality.
        </p>
      </CardContent>
    </Card>
  );
};
