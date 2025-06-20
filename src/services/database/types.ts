
// Common database types and utilities
export interface DatabaseResult<T> {
  data: T | null;
  error: Error | null;
}

export interface QueryOptions {
  throwOnError?: boolean;
  defaultValue?: any;
}

// Normalized data structures to prevent null reference errors
export interface SafeCandidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  applications: SafeApplication[];
  candidate_tags: SafeCandidateTag[];
}

export interface SafeApplication {
  id: string;
  candidate_id: string;
  job_role_id: string;
  status: 'applied' | 'reviewed' | 'interview_scheduled' | 'interview_completed' | 'offer_sent' | 'hired' | 'rejected';
  rating: number | null;
  notes: string | null;
  has_resume: boolean;
  has_voice_recording: boolean;
  has_video: boolean;
  interview_date: string | null;
  interview_recording_link: string | null;
  offer_sent_date: string | null;
  applied_date: string;
  updated_at: string | null;
  voice_analysis_score: number | null;
  voice_analysis_feedback: string | null;
  voice_transcription: string | null;
  voice_analysis_completed_at: string | null;
  voice_clarity_score: number | null;
  voice_pacing_score: number | null;
  voice_tone_score: number | null;
  voice_energy_score: number | null;
  voice_confidence_score: number | null;
  form_data: any | null;
  zoom_recording_url: string | null;
  zoom_recording_files: any | null;
  ghl_appointment_data: any | null;
  video_analysis_results: string | null;
  video_analysis_timestamp: string | null;
  pre_screening_responses: SafePreScreeningResponse[];
  candidate: SafeCandidateInfo;
  job_role: SafeJobRole;
}

export interface SafeCandidateInfo {
  name: string;
  email: string;
  phone: string | null;
  candidate_tags: SafeCandidateTag[];
}

export interface SafeJobRole {
  name: string;
  booking_link: string | null;
}

export interface SafeCandidateTag {
  tag: string;
}

export interface SafePreScreeningResponse {
  motivation_response: string;
  motivation_score: number;
  experience_response: string;
  experience_score: number;
  availability_response: string;
  availability_score: number;
  communication_score: number;
  overall_prescreening_score: number;
  scored_at?: string;
}
