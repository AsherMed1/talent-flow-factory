
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/hooks/useApplications';
import { ApplicationStatus } from './PipelineStages';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useEmailTemplates } from '@/hooks/useEmailTemplates';

export const useStatusUpdateHandler = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sendTemplateEmail } = useEmailTemplates();

  const handleStatusChange = async (
    applicationId: string, 
    newStatus: ApplicationStatus, 
    candidateData: Application,
    onStatusChanged?: (applicationId: string, newStatus: ApplicationStatus) => void,
    isApproveAction?: boolean // New parameter to indicate if this was triggered by the green checkmark
  ) => {
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

      // Get job role details for booking link
      const { data: jobRoleData, error: jobRoleError } = await supabase
        .from('job_roles')
        .select('booking_link')
        .eq('id', candidateData.job_role_id)
        .single();

      if (jobRoleError) {
        console.error('Error fetching job role data:', jobRoleError);
      }

      // Prepare candidate info for emails
      const candidateName = candidateData.candidates.name;
      const candidateEmail = candidateData.candidates.email;
      const jobRole = candidateData.job_roles?.name || 'General';
      const firstName = candidateData.form_data?.basicInfo?.firstName || candidateName.split(' ')[0];
      const lastName = candidateData.form_data?.basicInfo?.lastName || candidateName.split(' ').slice(1).join(' ');
      const bookingLink = jobRoleData?.booking_link;

      console.log('Email sending preparation:', {
        newStatus,
        candidateName,
        candidateEmail,
        jobRole,
        firstName,
        lastName,
        bookingLink,
        isApproveAction
      });

      // Send appropriate email based on status
      let emailSent = false;
      
      if (newStatus === 'reviewed') {
        // Send interview email when moved to reviewed status
        console.log('Sending interview email (moved to reviewed status)...');
        emailSent = await sendTemplateEmail({
          templateType: 'interview',
          candidateName,
          candidateEmail,
          firstName,
          lastName,
          jobRole,
          bookingLink
        });
      } else if (newStatus === 'rejected') {
        console.log('Sending rejection email...');
        emailSent = await sendTemplateEmail({
          templateType: 'thank_you',
          candidateName,
          candidateEmail,
          firstName,
          lastName,
          jobRole,
          bookingLink
        });
      } else if (newStatus === 'interview_scheduled') {
        console.log('Sending interview email...');
        emailSent = await sendTemplateEmail({
          templateType: 'interview',
          candidateName,
          candidateEmail,
          firstName,
          lastName,
          jobRole,
          bookingLink
        });
      } else if (newStatus === 'hired') {
        console.log('Sending welcome email...');
        emailSent = await sendTemplateEmail({
          templateType: 'welcome',
          candidateName,
          candidateEmail,
          firstName,
          lastName,
          jobRole,
          bookingLink
        });
      } else {
        console.log('No email template configured for status:', newStatus);
      }

      console.log('Email sending result:', emailSent);

      // Trigger webhook in background
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

      await queryClient.invalidateQueries({ queryKey: ['applications'] });
      
      if (onStatusChanged) {
        onStatusChanged(applicationId, newStatus);
      }

      toast({
        title: "Status Updated",
        description: `${candidateData.candidates.name} moved to ${newStatus.replace('_', ' ')}`,
      });
      
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update application status",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { handleStatusChange };
};
