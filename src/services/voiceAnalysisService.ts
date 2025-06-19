
import { supabase } from '@/integrations/supabase/client';

export const triggerVoiceAnalysis = async (
  applicationId: string,
  introductionRecording?: string,
  scriptRecording?: string
) => {
  const hasVoiceRecording = !!(introductionRecording || scriptRecording);
  
  if (hasVoiceRecording && (introductionRecording || scriptRecording)) {
    console.log('Triggering AI analysis for new application:', applicationId);
    
    try {
      const audioData = introductionRecording || scriptRecording;
      
      // Trigger the analyze-voice edge function in the background
      supabase.functions.invoke('analyze-voice', {
        body: {
          applicationId: applicationId,
          audioData: audioData
        }
      }).then(({ data: analysisData, error: analysisError }) => {
        if (analysisError) {
          console.error('Error in background AI analysis:', analysisError);
        } else {
          console.log('Background AI analysis completed:', analysisData);
        }
      });
      
    } catch (analysisError) {
      console.error('Error triggering AI analysis:', analysisError);
    }
  }
};
