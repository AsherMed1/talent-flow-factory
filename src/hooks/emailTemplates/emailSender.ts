
import { SendTemplateEmailParams } from './types';
import { getTemplateByType, replaceVariables } from './templateUtils';
import { useResendSender } from '../useResendSender';
import { useSmtpSender } from '../useSmtpSender';
import { useToast } from '../use-toast';
import { detectRoleType } from '@/utils/roleDetection';

export const useEmailSender = () => {
  const resend = useResendSender();
  const smtp = useSmtpSender();
  const { toast } = useToast();

  // Prioritize Resend if it's connected, otherwise fall back to SMTP
  const primarySender = resend.isConnected ? resend : smtp;
  const isConnected = resend.isConnected || smtp.isConnected;

  console.log('Email sender status:', {
    resendConnected: resend.isConnected,
    smtpConnected: smtp.isConnected,
    usingResend: resend.isConnected
  });

  const sendTemplateEmail = async ({
    templateType,
    candidateName,
    candidateEmail,
    firstName,
    lastName,
    jobRole = 'General',
    bookingLink
  }: SendTemplateEmailParams): Promise<boolean> => {
    if (!isConnected) {
      console.error('No email service connected');
      toast({
        title: "Email Not Configured",
        description: "Please configure your email settings before sending emails.",
        variant: "destructive",
      });
      return false;
    }

    console.log('Sending email via:', resend.isConnected ? 'Resend' : 'SMTP');

    // Detect if this is a video editor role for template selection
    const { isVideoEditor, isAppointmentSetter } = detectRoleType(jobRole);
    
    // Try to get role-specific template first
    let template = null;
    if (isVideoEditor && (templateType === 'interview' || templateType === 'welcome')) {
      const roleSpecificType = templateType === 'interview' ? 'video-editor-interview' : 'video-editor-welcome';
      template = getTemplateByType(roleSpecificType as any, jobRole);
      console.log(`Looking for video editor specific template: ${roleSpecificType}`, template ? 'Found' : 'Not found');
    }
    
    // Fall back to generic template if no role-specific template found
    if (!template) {
      template = getTemplateByType(templateType, jobRole);
    }
    
    if (!template) {
      console.error('Template not found for:', { templateType, jobRole, isVideoEditor });
      
      // Try to get a generic template without job role
      const genericTemplate = getTemplateByType(templateType);
      if (!genericTemplate) {
        console.error('No generic template found either for:', templateType);
        toast({
          title: "Template Not Found",
          description: `No ${templateType.replace('_', ' ')} email template found. Please check your email templates.`,
          variant: "destructive",
        });
        return false;
      }
      
      console.log('Using generic template:', genericTemplate.name);
      template = genericTemplate;
    }

    // Get current domain from window location
    const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';
    
    // Determine the appropriate application link based on role and template type
    let finalApplicationLink = bookingLink;
    
    if (templateType === 'interview' || templateType === 'application_update') {
      if (isVideoEditor) {
        finalApplicationLink = `${currentDomain}/apply/video-editor`;
      } else if (isAppointmentSetter) {
        finalApplicationLink = `${currentDomain}/apply/appointment-setter`;
      } else {
        // Generic application form
        finalApplicationLink = `${currentDomain}/apply`;
      }
    } else {
      // For other email types, use the provided booking link or default
      finalApplicationLink = bookingLink || 'https://link.patientpromarketing.com/widget/booking/1TnMI0I04dlMjYsoNxt3';
    }

    const variables = {
      firstName: firstName || candidateName.split(' ')[0] || 'Candidate',
      lastName: lastName || candidateName.split(' ').slice(1).join(' ') || '',
      candidateName,
      jobRole,
      email: candidateEmail,
      bookingLink: finalApplicationLink
    };

    const subject = replaceVariables(template.subject, variables);
    const htmlContent = replaceVariables(template.content, variables);

    console.log('Sending email:', {
      to: candidateEmail,
      subject,
      service: resend.isConnected ? 'Resend' : 'SMTP',
      templateUsed: template.name,
      isVideoEditorSpecific: isVideoEditor && template.id.includes('video-editor'),
      applicationLink: finalApplicationLink
    });

    try {
      const result = await primarySender.sendEmail({
        to: candidateEmail,
        subject,
        htmlContent
      });

      console.log('Email send result:', result);
      return result;
    } catch (error) {
      console.error('Email send error:', error);
      toast({
        title: "Email Send Failed",
        description: `Failed to send email to ${candidateEmail}`,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    sendTemplateEmail,
    isConnected
  };
};
