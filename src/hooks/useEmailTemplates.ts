
import { useGoHighLevel } from './useGoHighLevel';
import { getTemplates, getTemplateByType } from './emailTemplates/templateUtils';
import { useEmailSender } from './emailTemplates/emailSender';
import { EmailTemplate, SendTemplateEmailParams, TemplateType } from './emailTemplates/types';

export const useEmailTemplates = () => {
  const { isConfigured: isGoHighLevelConfigured } = useGoHighLevel();
  const { sendTemplateEmail, isConnected } = useEmailSender();

  return {
    getTemplates,
    getTemplateByType: (type: TemplateType, jobRole?: string) => getTemplateByType(type, jobRole),
    sendTemplateEmail,
    isConnected,
    isGoHighLevelConfigured
  };
};

// Re-export types for backward compatibility
export type { EmailTemplate, SendTemplateEmailParams };
