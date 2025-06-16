
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus, stages } from './PipelineStages';

interface ApplicationActionsProps {
  application: Application;
  currentStageIndex: number;
}

export const ApplicationActions = ({ application, currentStageIndex }: ApplicationActionsProps) => {
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

  return (
    <div className="flex gap-1">
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
    </div>
  );
};
