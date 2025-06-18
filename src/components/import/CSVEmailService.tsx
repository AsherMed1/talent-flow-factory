
import { useToast } from '@/hooks/use-toast';
import { useEmailSender } from '@/hooks/emailTemplates/emailSender';

interface CSVEmailServiceProps {
  onEmailStatusUpdate: (isSending: boolean) => void;
}

export const useCSVEmailService = ({ onEmailStatusUpdate }: CSVEmailServiceProps) => {
  const { toast } = useToast();
  const { sendTemplateEmail, isConnected } = useEmailSender();

  const sendApplicationEmails = async (candidates: any[], selectedJobRole: any) => {
    console.log('=== CSV Email Service Debug ===');
    console.log('Starting email send process...');
    console.log('Email service connected:', isConnected);
    console.log('Candidates to email:', candidates.length);
    console.log('Selected job role:', selectedJobRole?.name);

    if (!isConnected) {
      console.error('Email service not connected');
      toast({
        title: "Email Not Configured",
        description: "Please configure your email settings in Settings > Email Integration before importing candidates.",
        variant: "destructive",
      });
      return false;
    }

    if (!candidates || candidates.length === 0) {
      console.error('No candidates provided');
      toast({
        title: "No Candidates",
        description: "No candidates found to send emails to.",
        variant: "destructive",
      });
      return false;
    }

    onEmailStatusUpdate(true);
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    for (const candidate of candidates) {
      try {
        console.log(`\n--- Processing candidate: ${candidate.firstName} ${candidate.lastName} ---`);
        console.log('Candidate email:', candidate.email);
        
        if (!candidate.email) {
          console.error(`No email address for candidate: ${candidate.firstName} ${candidate.lastName}`);
          failureCount++;
          errors.push(`No email address for ${candidate.firstName} ${candidate.lastName}`);
          continue;
        }

        console.log('Calling sendTemplateEmail with params:', {
          templateType: 'application_update',
          candidateName: `${candidate.firstName} ${candidate.lastName}`,
          candidateEmail: candidate.email,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          jobRole: selectedJobRole?.name || 'General',
          bookingLink: selectedJobRole?.booking_link
        });

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
          console.log(`✅ Email sent successfully to ${candidate.email}`);
          successCount++;
        } else {
          console.error(`❌ Failed to send email to ${candidate.email}`);
          failureCount++;
          errors.push(`Failed to send to ${candidate.email}`);
        }

        // Small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`💥 Error sending email to ${candidate.email}:`, error);
        failureCount++;
        errors.push(`Error sending to ${candidate.email}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    onEmailStatusUpdate(false);

    console.log(`\n=== Email sending complete ===`);
    console.log(`Success: ${successCount}, Failed: ${failureCount}`);
    console.log('Errors:', errors);

    if (successCount > 0) {
      toast({
        title: "Application Emails Sent",
        description: `Successfully sent ${successCount} application emails${failureCount > 0 ? `. ${failureCount} failed to send.` : '.'}`,
      });
    }

    if (failureCount > 0) {
      console.error('Email failures:', errors);
      toast({
        title: "Email Send Failed",
        description: `Failed to send ${failureCount} application emails. Check console for detailed error logs.`,
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
