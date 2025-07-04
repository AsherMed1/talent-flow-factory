
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/hooks/useApplications';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useVoiceAnalysisHandler = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAnalyzeVoice = async (application: Application, forceReAnalysis = false) => {
    if (!application.has_voice_recording && !application.form_data?.voiceRecordings?.hasIntroduction && !application.form_data?.voiceRecordings?.hasScript) {
      toast({
        title: "No Voice Recording",
        description: "This application doesn't have voice recordings to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Check if already analyzed and not forcing re-analysis
    if (application.voice_analysis_score && !forceReAnalysis) {
      toast({
        title: "Already Analyzed",
        description: "This voice recording has already been analyzed. Use re-analyze to update the results.",
        variant: "destructive",
      });
      return;
    }

    console.log('Triggering voice analysis for application:', application.id, forceReAnalysis ? '(re-analysis)' : '');

    try {
      const voiceRecordings = application.form_data?.voiceRecordings;
      let audioData = null;

      if (voiceRecordings?.introductionRecording) {
        audioData = voiceRecordings.introductionRecording;
      } else if (voiceRecordings?.scriptRecording) {
        audioData = voiceRecordings.scriptRecording;
      }

      if (!audioData) {
        throw new Error('No audio data found in voice recordings');
      }

      const { data, error } = await supabase.functions.invoke('analyze-voice', {
        body: {
          applicationId: application.id,
          audioData: audioData
        }
      });

      if (error) throw error;

      toast({
        title: forceReAnalysis ? "Re-Analysis Complete" : "Analysis Complete",
        description: "Voice analysis has been completed successfully with updated criteria.",
      });

      await queryClient.invalidateQueries({ queryKey: ['applications'] });

    } catch (error) {
      console.error('Error analyzing voice:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze voice recording.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { handleAnalyzeVoice };
};
