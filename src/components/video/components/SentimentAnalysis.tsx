
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare } from 'lucide-react';
import { VideoAnalysisResults } from '../types/VideoAnalysisTypes';
import { getSentimentColor } from '../utils/videoAnalysisUtils';

interface SentimentAnalysisProps {
  results: VideoAnalysisResults;
}

export const SentimentAnalysis = ({ results }: SentimentAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-orange-600" />
          Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Overall Sentiment</span>
          <Badge className={getSentimentColor(results.sentimentAnalysis.overall)}>
            {results.sentimentAnalysis.overall.charAt(0).toUpperCase() + 
             results.sentimentAnalysis.overall.slice(1)}
          </Badge>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700">{results.sentimentAnalysis.details}</p>
        </div>
        <div className="text-xs text-gray-500">
          Confidence: {Math.round(results.sentimentAnalysis.confidence * 100)}%
        </div>
      </CardContent>
    </Card>
  );
};
