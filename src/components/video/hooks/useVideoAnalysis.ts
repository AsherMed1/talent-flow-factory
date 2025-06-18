
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VideoAnalysisResults, AnalysisError } from '../types/VideoAnalysisTypes';
import { getRecordingUrl } from '../utils/videoAnalysisUtils';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS = [2000, 5000, 10000]; // Progressive delays in ms

export const useVideoAnalysis = (application: any, autoAnalyze: boolean = false) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<VideoAnalysisResults | null>(
    application.video_analysis_results ? JSON.parse(application.video_analysis_results) : null
  );
  const [error, setError] = useState<AnalysisError | null>(null);
  const [retryCount, setRetryCount] = useState(application.video_analysis_retry_count || 0);
  const [analysisStatus, setAnalysisStatus] = useState(application.video_analysis_status || 'pending');
  const { toast } = useToast();

  const logAnalysisAttempt = async (status: string, errorType?: string, errorMessage?: string, errorDetails?: any) => {
    try {
      await supabase.from('video_analysis_logs').insert({
        application_id: application.id,
        attempt_number: retryCount + 1,
        status,
        error_type: errorType,
        error_message: errorMessage,
        error_details: errorDetails,
        ai_model_used: 'gpt-4o-mini'
      });
    } catch (logError) {
      console.error('Failed to log analysis attempt:', logError);
    }
  };

  const updateApplicationStatus = async (status: string, errorMessage?: string) => {
    try {
      const updateData: any = {
        video_analysis_status: status,
        video_analysis_retry_count: retryCount
      };

      if (status === 'processing') {
        updateData.video_analysis_started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.video_analysis_completed_at = new Date().toISOString();
      } else if (status === 'failed') {
        updateData.video_analysis_error = errorMessage;
      }

      await supabase
        .from('applications')
        .update(updateData)
        .eq('id', application.id);

      setAnalysisStatus(status);
    } catch (updateError) {
      console.error('Failed to update application status:', updateError);
    }
  };

  const determineErrorType = (error: any): AnalysisError => {
    const errorMessage = error.message || 'Unknown error occurred';
    
    if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
      return {
        type: 'timeout',
        message: 'Analysis timed out. The video may be too long or the service is busy.',
        retryable: true
      };
    }
    
    if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
      return {
        type: 'quota_exceeded',
        message: 'API quota exceeded. Please try again later.',
        retryable: true
      };
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return {
        type: 'network_error',
        message: 'Network error occurred. Please check your connection.',
        retryable: true
      };
    }
    
    if (errorMessage.includes('video') || errorMessage.includes('recording')) {
      return {
        type: 'invalid_video',
        message: 'Unable to process the video recording. Please ensure it\'s accessible.',
        retryable: false
      };
    }
    
    if (errorMessage.includes('OpenAI') || errorMessage.includes('API')) {
      return {
        type: 'api_error',
        message: 'AI service error. Please try again.',
        retryable: true
      };
    }
    
    return {
      type: 'processing_error',
      message: errorMessage,
      details: error,
      retryable: true
    };
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const performAnalysis = async (attemptNumber: number = 1): Promise<VideoAnalysisResults | null> => {
    const recordingUrl = getRecordingUrl(application);
    if (!recordingUrl) {
      throw new Error('No video recording URL found');
    }

    await logAnalysisAttempt('started');
    
    const startTime = Date.now();
    
    try {
      const { data, error: functionError } = await supabase.functions.invoke('analyze-interview-video', {
        body: {
          videoUrl: recordingUrl,
          candidateName: application.candidates.name,
          jobRole: application.job_roles?.name || 'Unknown',
          applicationId: application.id,
          enhancedAnalysis: true // Flag for enhanced analysis
        }
      });

      if (functionError) throw functionError;

      const processingTime = Math.round((Date.now() - startTime) / 1000);
      await logAnalysisAttempt('completed', undefined, undefined, { processing_time: processingTime });

      return data as VideoAnalysisResults;

    } catch (err: any) {
      const processingTime = Math.round((Date.now() - startTime) / 1000);
      const analysisError = determineErrorType(err);
      
      await logAnalysisAttempt('failed', analysisError.type, analysisError.message, {
        processing_time: processingTime,
        error_details: analysisError.details
      });

      throw analysisError;
    }
  };

  const analyzeVideo = async (): Promise<VideoAnalysisResults | null> => {
    if (isAnalyzing) return null;

    setIsAnalyzing(true);
    setError(null);
    await updateApplicationStatus('processing');

    let currentAttempt = 1;
    let lastError: AnalysisError | null = null;

    while (currentAttempt <= MAX_RETRY_ATTEMPTS) {
      try {
        console.log(`Analysis attempt ${currentAttempt} for application:`, application.id);
        
        const results = await performAnalysis(currentAttempt);
        
        if (results) {
          setAnalysisResults(results);
          setRetryCount(0);

          // Save results to database
          const { error: updateError } = await supabase
            .from('applications')
            .update({
              video_analysis_results: JSON.stringify(results),
              video_analysis_timestamp: new Date().toISOString(),
              video_analysis_retry_count: 0
            } as any)
            .eq('id', application.id);

          if (updateError) {
            console.error('Failed to save analysis results:', updateError);
          }

          await updateApplicationStatus('completed');

          toast({
            title: "Video Analysis Complete",
            description: "Enhanced AI analysis of the interview video has been completed successfully.",
          });

          setIsAnalyzing(false);
          return results;
        }

      } catch (err: any) {
        lastError = err as AnalysisError;
        console.error(`Analysis attempt ${currentAttempt} failed:`, lastError);

        // Update retry count
        const newRetryCount = currentAttempt;
        setRetryCount(newRetryCount);
        
        await supabase
          .from('applications')
          .update({ video_analysis_retry_count: newRetryCount } as any)
          .eq('id', application.id);

        // If error is not retryable or we've reached max attempts, stop
        if (!lastError.retryable || currentAttempt >= MAX_RETRY_ATTEMPTS) {
          break;
        }

        // Wait before retrying
        if (currentAttempt < MAX_RETRY_ATTEMPTS) {
          const delayMs = RETRY_DELAYS[currentAttempt - 1] || 10000;
          console.log(`Retrying in ${delayMs}ms...`);
          await updateApplicationStatus('retrying');
          await delay(delayMs);
        }

        currentAttempt++;
      }
    }

    // All attempts failed
    if (lastError) {
      setError(lastError);
      await updateApplicationStatus('failed', lastError.message);

      const isRetryable = lastError.retryable && retryCount < MAX_RETRY_ATTEMPTS;
      
      toast({
        title: "Analysis Failed",
        description: `${lastError.message}${isRetryable ? ' You can try again.' : ''}`,
        variant: "destructive",
      });
    }

    setIsAnalyzing(false);
    return null;
  };

  // Auto-analyze when recording URL becomes available
  useEffect(() => {
    if (autoAnalyze && getRecordingUrl(application) && !analysisResults && !isAnalyzing && analysisStatus === 'pending') {
      console.log('Auto-triggering enhanced video analysis for:', application.candidates.name);
      analyzeVideo();
    }
  }, [application.interview_recording_link, application.zoom_recording_url, autoAnalyze]);

  return {
    isAnalyzing,
    analysisResults,
    error,
    retryCount,
    analysisStatus,
    analyzeVideo
  };
};
