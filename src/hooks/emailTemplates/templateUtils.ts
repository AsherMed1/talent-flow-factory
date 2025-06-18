
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
  
  console.log('Looking for template:', { type, jobRole, availableTemplates: templates.map(t => ({ name: t.name, jobRole: t.jobRole, isDefault: t.isDefault })) });
  
  // Try to find a job-specific template first
  if (jobRole) {
    const jobSpecificTemplate = templates.find(t => 
      t.name.toLowerCase().includes(type.replace('_', ' ')) && 
      t.jobRole.toLowerCase() === jobRole.toLowerCase()
    );
    if (jobSpecificTemplate) {
      console.log('Found job-specific template:', jobSpecificTemplate.name);
      return jobSpecificTemplate;
    }
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
  
  // Look for default template
  const defaultTemplate = templates.find(t => 
    t.name.toLowerCase().includes(searchTerm) && t.isDefault
  );
  
  if (defaultTemplate) {
    console.log('Found default template:', defaultTemplate.name);
    return defaultTemplate;
  }
  
  // If no specific default found, try to find any template that matches the type
  const anyMatchingTemplate = templates.find(t => 
    t.name.toLowerCase().includes(searchTerm)
  );
  
  if (anyMatchingTemplate) {
    console.log('Found any matching template:', anyMatchingTemplate.name);
    return anyMatchingTemplate;
  }
  
  console.error('No template found for type:', type, 'with search term:', searchTerm);
  return null;
};

export const replaceVariables = (content: string, variables: Record<string, string>): string => {
  let result = content;
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};
