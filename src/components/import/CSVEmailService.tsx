
import { useToast } from '@/hooks/use-toast';
import { useEmailSender } from '@/hooks/emailTemplates/emailSender';

interface CSVEmailServiceProps {
  onEmailStatusUpdate: (isSending: boolean) => void;
}

export const useCSVEmailService = ({ onEmailStatusUpdate }: CSVEmailServiceProps) => {
  const { toast } = useToast();
  const { sendTemplateEmail, isConnected } = useEmailSender();

  const sendApplicationEmails = async (candidates: any[], selectedJobRole: any) => {
    if (!isConnected) {
      toast({
        title: "Email Not Configured",
        description: "Please configure your email settings in Settings > Email Integration before importing candidates.",
        variant: "destructive",
      });
      return false;
    }

    onEmailStatusUpdate(true);
    let successCount = 0;
    let failureCount = 0;

    for (const candidate of candidates) {
      try {
        const success = await sendTemplateEmail({
          templateType: 'application_update',
          candidateName: `${candidate.firstName} ${candidate.lastName}`,
          candidateEmail: candidate.email,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          jobRole: selectedJobRole?.name || 'General',
          bookingLink: selectedJobRole?.booking_link
        });

        if (success) {
          successCount++;
        } else {
          failureCount++;
        }

        // Small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Failed to send email to ${candidate.email}:`, error);
        failureCount++;
      }
    }

    onEmailStatusUpdate(false);

    if (successCount > 0) {
      toast({
        title: "Application Emails Sent",
        description: `Successfully sent ${successCount} application emails${failureCount > 0 ? `. ${failureCount} failed to send.` : '.'}`,
      });
    }

    if (failureCount > 0 && successCount === 0) {
      toast({
        title: "Email Send Failed",
        description: `Failed to send ${failureCount} application emails. Please check your email configuration.`,
        variant: "destructive",
      });
    }

    return successCount > 0;
  };

  return {
    sendApplicationEmails,
    isConnected
  };
};
