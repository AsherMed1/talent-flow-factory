
import { SendTemplateEmailParams } from './types';
import { getTemplateByType, replaceVariables } from './templateUtils';
import { useResendSender } from '../useResendSender';
import { useSmtpSender } from '../useSmtpSender';
import { useToast } from '../use-toast';

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

    const template = getTemplateByType(templateType, jobRole);
    if (!template) {
      console.error('Template not found:', templateType, jobRole);
      toast({
        title: "Template Not Found",
        description: `No ${templateType.replace('_', ' ')} email template found for ${jobRole}`,
        variant: "destructive",
      });
      return false;
    }

    // For the interview/congratulations email, direct candidates to the application form
    // For application_update email, also use the application form
    let finalApplicationLink = bookingLink;
    if (templateType === 'interview' || templateType === 'application_update') {
      // Get current domain from window location
      const currentDomain = typeof window !== 'undefined' ? window.location.origin : '';
      finalApplicationLink = `${currentDomain}/apply`;
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
      service: resend.isConnected ? 'Resend' : 'SMTP'
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
