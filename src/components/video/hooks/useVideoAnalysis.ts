
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VideoAnalysisResults } from '../types/VideoAnalysisTypes';
import { getRecordingUrl } from '../utils/videoAnalysisUtils';

export const useVideoAnalysis = (application: any, autoAnalyze: boolean = false) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<VideoAnalysisResults | null>(
    application.video_analysis_results ? JSON.parse(application.video_analysis_results) : null
  );
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeVideo = async () => {
    const recordingUrl = getRecordingUrl(application);
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

      // Save results to database - using type assertion for the new columns
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          video_analysis_results: JSON.stringify(results),
          video_analysis_timestamp: new Date().toISOString()
        } as any)
        .eq('id', application.id);

      if (updateError) throw updateError;

      toast({
        title: "Video Analysis Complete",
        description: "AI analysis of the interview video has been completed successfully.",
      });

      return results;

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

  // Auto-analyze when recording URL becomes available
  useEffect(() => {
    if (autoAnalyze && getRecordingUrl(application) && !analysisResults && !isAnalyzing) {
      console.log('Auto-triggering video analysis for:', application.candidates.name);
      analyzeVideo();
    }
  }, [application.interview_recording_link, application.zoom_recording_url, autoAnalyze]);

  return {
    isAnalyzing,
    analysisResults,
    error,
    analyzeVideo
  };
};
