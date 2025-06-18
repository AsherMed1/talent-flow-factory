
import { SendTemplateEmailParams } from './types';
import { getTemplateByType, replaceVariables } from './templateUtils';
import { useResendSender } from '../useResendSender';
import { useGoHighLevel } from '../useGoHighLevel';
import { useToast } from '../use-toast';

export const useEmailSender = () => {
  const { sendEmail, isConnected } = useResendSender();
  const { getBookingLink } = useGoHighLevel();
  const { toast } = useToast();

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
      toast({
        title: "Email Not Configured",
        description: "Please configure your email settings before sending emails.",
        variant: "destructive",
      });
      return false;
    }

    const template = getTemplateByType(templateType, jobRole);
    if (!template) {
      toast({
        title: "Template Not Found",
        description: `No ${templateType.replace('_', ' ')} email template found for ${jobRole}`,
        variant: "destructive",
      });
      return false;
    }

    // Always use the correct Patient Pro Marketing booking link
    const finalBookingLink = 'https://link.patientpromarketing.com/widget/booking/1TnMI0I04dlMjYsoNxt3';

    const variables = {
      firstName: firstName || candidateName.split(' ')[0] || 'Candidate',
      lastName: lastName || candidateName.split(' ').slice(1).join(' ') || '',
      candidateName,
      jobRole,
      email: candidateEmail,
      bookingLink: finalBookingLink
    };

    const subject = replaceVariables(template.subject, variables);
    const htmlContent = replaceVariables(template.content, variables);

    return await sendEmail({
      to: candidateEmail,
      subject,
      htmlContent
    });
  };

  return {
    sendTemplateEmail,
    isConnected
  };
};
