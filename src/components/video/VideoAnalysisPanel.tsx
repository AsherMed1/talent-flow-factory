
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, MessageSquare, TrendingUp, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VideoAnalysisResults {
  speakingTimeRatio: {
    interviewer: number;
    candidate: number;
  };
  engagementLevel: number;
  keyTopics: string[];
  sentimentAnalysis: {
    overall: 'positive' | 'neutral' | 'negative';
    confidence: number;
    details: string;
  };
  recommendations: string[];
  analysisTimestamp: string;
}

interface VideoAnalysisPanelProps {
  application: Application;
  onAnalysisComplete?: (results: VideoAnalysisResults) => void;
}

export const VideoAnalysisPanel = ({ application, onAnalysisComplete }: VideoAnalysisPanelProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<VideoAnalysisResults | null>(
    application.video_analysis_results ? JSON.parse(application.video_analysis_results) : null
  );
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const getRecordingUrl = () => {
    if (application.interview_recording_link) return application.interview_recording_link;
    if (application.zoom_recording_url) return application.zoom_recording_url;
    if (application.zoom_recording_files?.[0]?.play_url) return application.zoom_recording_files[0].play_url;
    return null;
  };

  const analyzeVideo = async () => {
    const recordingUrl = getRecordingUrl();
    if (!recordingUrl) {
      setError('No video recording URL found');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('analyze-interview-video', {
        body: {
          videoUrl: recordingUrl,
          candidateName: application.candidates.name,
          jobRole: application.job_roles?.name || 'Unknown',
          applicationId: application.id
        }
      });

      if (functionError) throw functionError;

      const results: VideoAnalysisResults = data;
      setAnalysisResults(results);

      // Save results to database
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          video_analysis_results: JSON.stringify(results),
          video_analysis_timestamp: new Date().toISOString()
        })
        .eq('id', application.id);

      if (updateError) throw updateError;

      onAnalysisComplete?.(results);
      
      toast({
        title: "Video Analysis Complete",
        description: "AI analysis of the interview video has been completed successfully.",
      });

    } catch (err: any) {
      console.error('Video analysis error:', err);
      setError(err.message || 'Failed to analyze video');
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getEngagementLevel = (level: number) => {
    if (level >= 80) return { label: 'High', color: 'text-green-600' };
    if (level >= 60) return { label: 'Medium', color: 'text-yellow-600' };
    return { label: 'Low', color: 'text-red-600' };
  };

  if (!getRecordingUrl()) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <h3 className="font-medium text-gray-900 mb-2">No Video Recording</h3>
          <p className="text-sm text-gray-500">
            Add an interview recording link to enable AI analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Trigger */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Video Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!analysisResults && !isAnalyzing && (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                Analyze this interview video to get insights on speaking patterns, engagement, and sentiment.
              </p>
              <Button onClick={analyzeVideo} className="bg-purple-600 hover:bg-purple-700">
                <Brain className="w-4 h-4 mr-2" />
                Start AI Analysis
              </Button>
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
              <Button onClick={analyzeVideo} variant="outline">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults && (
        <>
          {/* Speaking Time Analysis */}
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
                    <span className="text-sm text-gray-600">{analysisResults.speakingTimeRatio.interviewer}%</span>
                  </div>
                  <Progress value={analysisResults.speakingTimeRatio.interviewer} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Candidate</span>
                    <span className="text-sm text-gray-600">{analysisResults.speakingTimeRatio.candidate}%</span>
                  </div>
                  <Progress value={analysisResults.speakingTimeRatio.candidate} className="h-2" />
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  {analysisResults.speakingTimeRatio.candidate > 60 
                    ? "Good: Candidate had ample time to express themselves."
                    : analysisResults.speakingTimeRatio.candidate < 30
                    ? "Concern: Candidate spoke very little. Consider if they were given enough opportunity."
                    : "Balanced: Good speaking time distribution."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Level */}
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
                  <Progress value={analysisResults.engagementLevel} className="w-24 h-2" />
                  <span className={`text-sm font-medium ${getEngagementLevel(analysisResults.engagementLevel).color}`}>
                    {getEngagementLevel(analysisResults.engagementLevel).label}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {analysisResults.engagementLevel}% engagement based on vocal patterns, response timing, and interaction quality.
              </p>
            </CardContent>
          </Card>

          {/* Sentiment Analysis */}
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
                <Badge className={getSentimentColor(analysisResults.sentimentAnalysis.overall)}>
                  {analysisResults.sentimentAnalysis.overall.charAt(0).toUpperCase() + 
                   analysisResults.sentimentAnalysis.overall.slice(1)}
                </Badge>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">{analysisResults.sentimentAnalysis.details}</p>
              </div>
              <div className="text-xs text-gray-500">
                Confidence: {Math.round(analysisResults.sentimentAnalysis.confidence * 100)}%
              </div>
            </CardContent>
          </Card>

          {/* Key Topics */}
          {analysisResults.keyTopics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Discussion Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysisResults.keyTopics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {analysisResults.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResults.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-gray-500 text-center">
            Analysis completed on {new Date(analysisResults.analysisTimestamp).toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
};
