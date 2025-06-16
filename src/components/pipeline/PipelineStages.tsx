
export type ApplicationStatus = 'applied' | 'reviewed' | 'interview_scheduled' | 'interview_completed' | 'offer_sent' | 'hired' | 'rejected';

export interface PipelineStage {
  name: ApplicationStatus;
  displayName: string;
  color: string;
}

export const stages: PipelineStage[] = [
  { name: 'applied' as ApplicationStatus, displayName: 'Applied', color: 'bg-gray-100' },
  { name: 'reviewed' as ApplicationStatus, displayName: 'Reviewed', color: 'bg-blue-100' },
  { name: 'interview_scheduled' as ApplicationStatus, displayName: 'Interview Scheduled', color: 'bg-yellow-100' },
  { name: 'interview_completed' as ApplicationStatus, displayName: 'Interview Completed', color: 'bg-purple-100' },
  { name: 'offer_sent' as ApplicationStatus, displayName: 'Offer Sent', color: 'bg-green-100' },
  { name: 'hired' as ApplicationStatus, displayName: 'Hired', color: 'bg-emerald-100' },
];
