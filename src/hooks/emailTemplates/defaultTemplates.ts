
import { EmailTemplate } from './types';
import { rejectionTemplate } from './templates/rejectionTemplate';
import { interviewTemplate } from './templates/interviewTemplate';
import { holdForFutureTemplate } from './templates/holdForFutureTemplate';
import { thankYouTemplate } from './templates/thankYouTemplate';
import { welcomeTemplate } from './templates/welcomeTemplate';
import { applicationUpdateTemplate } from './templates/applicationUpdateTemplate';
import { postInterviewRejectionTemplate } from './templates/postInterviewRejectionTemplate';

export const getDefaultTemplates = (fallbackBookingLink: string): EmailTemplate[] => {
  return [
    applicationUpdateTemplate,
    rejectionTemplate,
    interviewTemplate,
    holdForFutureTemplate,
    thankYouTemplate,
    welcomeTemplate,
    postInterviewRejectionTemplate
  ];
};
