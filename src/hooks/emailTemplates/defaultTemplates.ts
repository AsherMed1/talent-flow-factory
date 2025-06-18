
import { EmailTemplate } from './types';
import { rejectionTemplate } from './templates/rejectionTemplate';
import { interviewTemplate } from './templates/interviewTemplate';
import { holdForFutureTemplate } from './templates/holdForFutureTemplate';
import { thankYouTemplate } from './templates/thankYouTemplate';
import { welcomeTemplate } from './templates/welcomeTemplate';

export const getDefaultTemplates = (fallbackBookingLink: string): EmailTemplate[] => {
  return [
    rejectionTemplate,
    interviewTemplate,
    holdForFutureTemplate,
    thankYouTemplate,
    welcomeTemplate
  ];
};
