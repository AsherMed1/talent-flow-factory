
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Clock, CheckCircle2, RotateCcw, Play } from 'lucide-react';
import { AnalysisError } from '../types/VideoAnalysisTypes';

interface VideoAnalysisStatusProps {
  isAnalyzing: boolean;
  error: AnalysisError | null;
  hasResults: boolean;
  autoAnalyze: boolean;
  retryCount?: number;
  analysisStatus?: string;
  onAnalyze: () => void;
}

export const VideoAnalysisStatus = ({ 
  isAnalyzing, 
  error, 
  hasResults, 
  autoAnalyze, 
  retryCount = 0,
  analysisStatus = 'pending',
  onAnalyze 
}: VideoAnalysisStatusProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'retrying': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4 animate-spin" />;
      case 'retrying': return <RotateCcw className="w-4 h-4 animate-spin" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Analysis Complete';
      case 'processing': return 'Analyzing Video...';
      case 'retrying': return `Retrying... (Attempt ${retryCount + 1})`;
      case 'failed': return 'Analysis Failed';
      default: return 'Ready to Analyze';
    }
  };

  if (hasResults && !isAnalyzing && !error) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Enhanced AI Analysis Complete</span>
              <Badge className="bg-green-100 text-green-800">
                Latest Analysis
              </Badge>
            </div>
            <Button
              onClick={onAnalyze}
              variant="outline"
              size="sm"
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              Re-analyze
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Analysis Failed</span>
                {retryCount > 0 && (
                  <Badge variant="outline" className="text-red-600 border-red-300">
                    {retryCount} attempts
                  </Badge>
                )}
              </div>
              <p className="text-sm text-red-700 mb-2">{error.message}</p>
              {error.type && (
                <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                  {error.type.replace('_', ' ')}
                </Badge>
              )}
            </div>
            {error.retryable && (
              <Button
                onClick={onAnalyze}
                variant="outline"
                size="sm"
                className="text-red-700 border-red-300 hover:bg-red-100"
                disabled={isAnalyzing}
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="font-medium text-blue-800">
              {getStatusText(analysisStatus)}
            </span>
            <Badge className={getStatusColor(analysisStatus)}>
              {getStatusIcon(analysisStatus)}
              Enhanced Analysis
            </Badge>
          </div>
          <p className="text-sm text-blue-700 mt-2">
            {analysisStatus === 'retrying' 
              ? 'Previous attempt failed, trying again with enhanced error handling...'
              : 'Performing comprehensive AI analysis including sentiment tracking, communication skills assessment, and key moment identification...'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  if (autoAnalyze) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Waiting for video recording...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Enhanced AI Video Analysis</span>
            <Badge variant="outline">
              New Features
            </Badge>
          </div>
          <Button onClick={onAnalyze} size="sm">
            Start Analysis
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Advanced analysis including speaker detection, sentiment tracking, communication skills scoring, and key moment identification.
        </p>
      </CardContent>
    </Card>
  );
};
