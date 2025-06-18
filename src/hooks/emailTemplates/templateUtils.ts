
import { EmailTemplate, TemplateType } from './types';
import { getDefaultTemplates } from './defaultTemplates';

export const getTemplates = (): EmailTemplate[] => {
  const saved = localStorage.getItem('emailTemplates');
  if (saved) {
    return JSON.parse(saved);
  }
  return getDefaultTemplates('');
};

export const getTemplateByType = (
  type: TemplateType, 
  jobRole?: string,
  fallbackBookingLink?: string
): EmailTemplate | null => {
  const templates = getTemplates();
  
  // Try to find a job-specific template first
  if (jobRole) {
    const jobSpecificTemplate = templates.find(t => 
      t.name.toLowerCase().includes(type.replace('_', ' ')) && 
      t.jobRole.toLowerCase() === jobRole.toLowerCase()
    );
    if (jobSpecificTemplate) return jobSpecificTemplate;
  }
  
  // Fall back to default template based on type
  let searchTerm = '';
  switch (type) {
    case 'application_update':
      searchTerm = 'application update';
      break;
    case 'rejection':
      searchTerm = 'kind rejection after application';
      break;
    case 'interview':
      searchTerm = 'interview';
      break;
    case 'hold_for_future':
      searchTerm = 'hold for future';
      break;
    case 'welcome':
      searchTerm = 'welcome';
      break;
    case 'thank_you':
      searchTerm = 'thank you';
      break;
    case 'post_interview_rejection':
      searchTerm = 'final rejection after interview';
      break;
  }
  
  const defaultTemplate = templates.find(t => 
    t.name.toLowerCase().includes(searchTerm) && t.isDefault
  );
  
  return defaultTemplate || null;
};

export const replaceVariables = (content: string, variables: Record<string, string>): string => {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};
