
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  jobRole: string;
  isDefault: boolean;
}

export interface SendTemplateEmailParams {
  templateType: 'rejection' | 'interview' | 'hold_for_future' | 'welcome' | 'thank_you' | 'application_update' | 'post_interview_rejection';
  candidateName: string;
  candidateEmail: string;
  firstName?: string;
  lastName?: string;
  jobRole?: string;
  bookingLink?: string;
}

export type TemplateType = 'rejection' | 'interview' | 'hold_for_future' | 'welcome' | 'thank_you' | 'application_update' | 'post_interview_rejection';
