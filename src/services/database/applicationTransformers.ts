
import { SafeApplication } from './types';

export class ApplicationTransformers {
  // Transform raw application data to SafeApplication format
  static transformToSafeApplication(data: any): SafeApplication {
    return {
      id: data.id,
      candidate_id: data.candidate_id,
      job_role_id: data.job_role_id,
      status: data.status,
      rating: data.rating,
      notes: data.notes,
      has_resume: data.has_resume,
      has_voice_recording: data.has_voice_recording,
      has_video: data.has_video,
      interview_date: data.interview_date,
      interview_recording_link: data.interview_recording_link,
      offer_sent_date: data.offer_sent_date,
      applied_date: data.applied_date,
      updated_at: data.updated_at,
      voice_analysis_score: data.voice_analysis_score,
      voice_analysis_feedback: data.voice_analysis_feedback,
      voice_transcription: data.voice_transcription,
      voice_analysis_completed_at: data.voice_analysis_completed_at,
      voice_clarity_score: data.voice_clarity_score,
      voice_pacing_score: data.voice_pacing_score,
      voice_tone_score: data.voice_tone_score,
      voice_energy_score: data.voice_energy_score,
      voice_confidence_score: data.voice_confidence_score,
      form_data: data.form_data,
      zoom_recording_url: data.zoom_recording_url,
      zoom_recording_files: data.zoom_recording_files,
      ghl_appointment_data: data.ghl_appointment_data,
      video_analysis_results: data.video_analysis_results,
      video_analysis_timestamp: data.video_analysis_timestamp,
      pre_screening_responses: data.pre_screening_responses ? [{
        motivation_response: data.pre_screening_responses.motivation_response || '',
        motivation_score: data.pre_screening_responses.motivation_score || 0,
        experience_response: data.pre_screening_responses.experience_response || '',
        experience_score: data.pre_screening_responses.experience_score || 0,
        availability_response: data.pre_screening_responses.availability_response || '',
        availability_score: data.pre_screening_responses.availability_score || 0,
        communication_score: data.pre_screening_responses.communication_score || 0,
        overall_prescreening_score: data.pre_screening_responses.overall_prescreening_score || 0
      }] : [],
      candidate: data.candidates ? {
        name: data.candidates.name,
        email: data.candidates.email,
        phone: data.candidates.phone,
        candidate_tags: data.candidates.candidate_tags || []
      } : {
        name: '',
        email: '',
        phone: null,
        candidate_tags: []
      },
      job_role: data.job_roles ? {
        name: data.job_roles.name,
        booking_link: data.job_roles.booking_link
      } : {
        name: '',
        booking_link: null
      }
    };
  }
}
