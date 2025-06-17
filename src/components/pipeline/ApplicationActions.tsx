
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus, stages } from './PipelineStages';
import { Brain, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ApplicationActionsProps {
  application: Application;
  currentStageIndex: number;
}

export const ApplicationActions = ({ application, currentStageIndex }: ApplicationActionsProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus, candidateData: any) => {
    console.log('Updating application status:', applicationId, newStatus);
    
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      try {
        const webhookData = {
          application: {
            id: applicationId,
            previousStatus: candidateData.status,
            newStatus: newStatus,
          },
          candidate: candidateData.candidates,
          jobRole: candidateData.job_roles,
          timestamp: new Date().toISOString(),
        };

        await supabase.functions.invoke('trigger-webhook', {
          body: {
            eventType: 'status_changed',
            data: webhookData
          }
        });

        console.log('Webhook triggered for status change');
      } catch (webhookError) {
        console.error('Error triggering webhook:', webhookError);
      }

      window.location.reload();
      
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleAnalyzeVoice = async () => {
    if (!application.has_voice_recording && !application.form_data?.voiceRecordings?.hasIntroduction && !application.form_data?.voiceRecordings?.hasScript) {
      toast({
        title: "No Voice Recording",
        description: "This application doesn't have voice recordings to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    console.log('Triggering voice analysis for application:', application.id);

    try {
      // Get the voice recording data from form_data
      const voiceRecordings = application.form_data?.voiceRecordings;
      let audioData = null;

      // Try to get audio data from either introduction or script recording
      if (voiceRecordings?.introductionRecording) {
        audioData = voiceRecordings.introductionRecording;
      } else if (voiceRecordings?.scriptRecording) {
        audioData = voiceRecordings.scriptRecording;
      }

      if (!audioData) {
        throw new Error('No audio data found in voice recordings');
      }

      // Call the analyze-voice edge function
      const { data, error } = await supabase.functions.invoke('analyze-voice', {
        body: {
          applicationId: application.id,
          audioData: audioData
        }
      });

      if (error) throw error;

      toast({
        title: "Analysis Complete",
        description: "Voice analysis has been completed successfully.",
      });

      // Refresh the page to show the new analysis
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error analyzing voice:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze voice recording.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasVoiceRecording = application.has_voice_recording || 
    application.form_data?.voiceRecordings?.hasIntroduction || 
    application.form_data?.voiceRecordings?.hasScript;

  const hasAnalysis = application.voice_analysis_score !== null;

  return (
    <div className="flex gap-1 flex-wrap">
      <Button 
        size="sm" 
        className="text-xs h-7 bg-green-500 hover:bg-green-600"
        onClick={() => {
          const nextStageIndex = currentStageIndex + 1;
          if (nextStageIndex < stages.length) {
            handleStatusChange(application.id, stages[nextStageIndex].name, application);
          } else {
            handleStatusChange(application.id, 'hired', application);
          }
        }}
      >
        ✓
      </Button>
      <Button 
        size="sm" 
        variant="destructive" 
        className="text-xs h-7"
        onClick={() => handleStatusChange(application.id, 'rejected', application)}
      >
        ✕
      </Button>
      <Button size="sm" variant="outline" className="text-xs h-7">
        ⏳
      </Button>
      
      {/* AI Analysis Button */}
      {hasVoiceRecording && !hasAnalysis && (
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-7 bg-purple-50 hover:bg-purple-100 border-purple-200"
          onClick={handleAnalyzeVoice}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Brain className="w-3 h-3" />
          )}
        </Button>
      )}
    </div>
  );
};
