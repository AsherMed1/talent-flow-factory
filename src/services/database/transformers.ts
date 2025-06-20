
import { SafeCandidate, SafeApplication, SafeCandidateInfo, SafeJobRole, SafeCandidateTag, SafePreScreeningResponse } from './types';

// Data transformation utilities with null safety
export class DataTransformers {
  static transformCandidateInfo(rawData: any): SafeCandidateInfo {
    if (!rawData || typeof rawData !== 'object') {
      return {
        name: 'Unknown Candidate',
        email: '',
        phone: null,
        candidate_tags: []
      };
    }

    return {
      name: rawData.name || 'Unknown Candidate',
      email: rawData.email || '',
      phone: rawData.phone || null,
      candidate_tags: this.transformCandidateTags(rawData.candidate_tags)
    };
  }

  static transformJobRole(rawData: any): SafeJobRole {
    if (!rawData || typeof rawData !== 'object') {
      return {
        name: 'Unknown Role',
        booking_link: null
      };
    }

    return {
      name: rawData.name || 'Unknown Role',
      booking_link: rawData.booking_link || null
    };
  }

  static transformCandidateTags(rawData: any[]): SafeCandidateTag[] {
    if (!Array.isArray(rawData)) {
      return [];
    }

    return rawData
      .filter(tag => tag && typeof tag === 'object' && tag.tag)
      .map(tag => ({ tag: tag.tag }));
  }

  static transformPreScreeningResponses(rawData: any[]): SafePreScreeningResponse[] {
    if (!Array.isArray(rawData)) {
      return [];
    }

    return rawData
      .filter(response => response && typeof response === 'object')
      .map(response => ({
        motivation_response: response.motivation_response || '',
        motivation_score: response.motivation_score || 0,
        experience_response: response.experience_response || '',
        experience_score: response.experience_score || 0,
        availability_response: response.availability_response || '',
        availability_score: response.availability_score || 0,
        communication_score: response.communication_score || 0,
        overall_prescreening_score: response.overall_prescreening_score || 0,
        scored_at: response.scored_at
      }));
  }

  static transformApplication(rawData: any): SafeApplication {
    if (!rawData || typeof rawData !== 'object') {
      throw new Error('Invalid application data');
    }

    return {
      id: rawData.id || '',
      candidate_id: rawData.candidate_id || '',
      job_role_id: rawData.job_role_id || '',
      status: rawData.status || 'applied',
      rating: rawData.rating,
      notes: rawData.notes,
      has_resume: rawData.has_resume || false,
      has_voice_recording: rawData.has_voice_recording || false,
      has_video: rawData.has_video || false,
      interview_date: rawData.interview_date,
      interview_recording_link: rawData.interview_recording_link,
      offer_sent_date: rawData.offer_sent_date,
      applied_date: rawData.applied_date || new Date().toISOString(),
      updated_at: rawData.updated_at,
      voice_analysis_score: rawData.voice_analysis_score,
      voice_analysis_feedback: rawData.voice_analysis_feedback,
      voice_transcription: rawData.voice_transcription,
      voice_analysis_completed_at: rawData.voice_analysis_completed_at,
      voice_clarity_score: rawData.voice_clarity_score,
      voice_pacing_score: rawData.voice_pacing_score,
      voice_tone_score: rawData.voice_tone_score,
      voice_energy_score: rawData.voice_energy_score,
      voice_confidence_score: rawData.voice_confidence_score,
      form_data: rawData.form_data,
      zoom_recording_url: rawData.zoom_recording_url,
      zoom_recording_files: rawData.zoom_recording_files,
      ghl_appointment_data: rawData.ghl_appointment_data,
      video_analysis_results: rawData.video_analysis_results,
      video_analysis_timestamp: rawData.video_analysis_timestamp,
      pre_screening_responses: this.transformPreScreeningResponses(rawData.pre_screening_responses),
      candidate: this.transformCandidateInfo(rawData.candidates),
      job_role: this.transformJobRole(rawData.job_roles)
    };
  }

  static transformCandidate(rawData: any): SafeCandidate {
    if (!rawData || typeof rawData !== 'object') {
      throw new Error('Invalid candidate data');
    }

    return {
      id: rawData.id || '',
      name: rawData.name || 'Unknown Candidate',
      email: rawData.email || '',
      phone: rawData.phone,
      created_at: rawData.created_at || new Date().toISOString(),
      applications: Array.isArray(rawData.applications) 
        ? rawData.applications.map((app: any) => ({
            ...this.transformApplication(app),
            candidate: this.transformCandidateInfo({ 
              name: rawData.name, 
              email: rawData.email, 
              phone: rawData.phone,
              candidate_tags: rawData.candidate_tags 
            })
          }))
        : [],
      candidate_tags: this.transformCandidateTags(rawData.candidate_tags)
    };
  }
}
