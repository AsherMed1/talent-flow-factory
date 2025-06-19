
import { EmailTemplate } from './types';
import { rejectionTemplate } from './templates/rejectionTemplate';
import { interviewTemplate } from './templates/interviewTemplate';
import { holdForFutureTemplate } from './templates/holdForFutureTemplate';
import { thankYouTemplate } from './templates/thankYouTemplate';
import { welcomeTemplate } from './templates/welcomeTemplate';
import { applicationUpdateTemplate } from './templates/applicationUpdateTemplate';
import { postInterviewRejectionTemplate } from './templates/postInterviewRejectionTemplate';
import { videoEditorInterviewTemplate } from './templates/videoEditorInterviewTemplate';
import { videoEditorWelcomeTemplate } from './templates/videoEditorWelcomeTemplate';

export const getDefaultTemplates = (fallbackBookingLink: string): EmailTemplate[] => {
  const templates = [
    applicationUpdateTemplate,
    rejectionTemplate,
    interviewTemplate,
    videoEditorInterviewTemplate, // Role-specific interview template
    holdForFutureTemplate,
    thankYouTemplate,
    welcomeTemplate,
    videoEditorWelcomeTemplate, // Role-specific welcome template
    postInterviewRejectionTemplate
  ];
  
  console.log('Loading default templates:', templates.map(t => ({ name: t.name, id: t.id, jobRole: t.jobRole })));
  
  return templates;
};
