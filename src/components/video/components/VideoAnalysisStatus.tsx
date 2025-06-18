
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, AlertCircle } from 'lucide-react';

interface VideoAnalysisStatusProps {
  isAnalyzing: boolean;
  error: string | null;
  hasResults: boolean;
  autoAnalyze: boolean;
  onAnalyze: () => void;
}

export const VideoAnalysisStatus = ({
  isAnalyzing,
  error,
  hasResults,
  autoAnalyze,
  onAnalyze
}: VideoAnalysisStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Video Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasResults && !isAnalyzing && (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              {autoAnalyze ? 'Analysis will start automatically when a recording link is added.' : 'Analyze this interview video to get insights on speaking patterns, engagement, and sentiment.'}
            </p>
            {!autoAnalyze && (
              <Button onClick={onAnalyze} className="bg-purple-600 hover:bg-purple-700">
                <Brain className="w-4 h-4 mr-2" />
                Start AI Analysis
              </Button>
            )}
          </div>
        )}

        {isAnalyzing && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
            <h4 className="font-medium mb-2">Analyzing Video...</h4>
            <p className="text-sm text-gray-600">This may take a few minutes</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={onAnalyze} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
