
import { supabase } from '@/integrations/supabase/client';
import { SafeApplication, DatabaseResult } from './types';

export class OptimizedApplicationService {
  // Transform raw application data to SafeApplication format
  private static transformToSafeApplication(data: any): SafeApplication {
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
        motivation_response: data.pre_screening_responses.motivation_response,
        motivation_score: data.pre_screening_responses.motivation_score,
        experience_response: data.pre_screening_responses.experience_response,
        experience_score: data.pre_screening_responses.experience_score,
        availability_response: data.pre_screening_responses.availability_response,
        availability_score: data.pre_screening_responses.availability_score,
        communication_score: data.pre_screening_responses.communication_score,
        overall_prescreening_score: data.pre_screening_responses.overall_prescreening_score
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

  // Get optimized paginated results with proper relationship specification
  static async getPaginatedOptimized(
    offset: number, 
    limit: number, 
    status?: string, 
    jobRoleId?: string
  ): Promise<DatabaseResult<{ applications: SafeApplication[], totalCount: number }>> {
    try {
      // Use the optimized database function instead of direct query to avoid relationship issues
      const { data, error } = await supabase.rpc('get_applications_paginated_v2', {
        p_offset: offset,
        p_limit: limit,
        p_status: status || null,
        p_job_role_id: jobRoleId || null,
        p_search_term: null
      });

      if (error) {
        console.error('Error in getPaginatedOptimized:', error);
        return { data: null, error: new Error(error.message) };
      }

      if (!data || data.length === 0) {
        return { data: { applications: [], totalCount: 0 }, error: null };
      }

      // Now get the full application data for the IDs we found
      const applicationIds = data.map((item: any) => item.id);
      
      const { data: fullApplications, error: fullError } = await supabase
        .from('applications')
        .select(`
          id,
          candidate_id,
          job_role_id,
          status,
          rating,
          notes,
          has_resume,
          has_voice_recording,
          has_video,
          interview_date,
          interview_recording_link,
          offer_sent_date,
          applied_date,
          updated_at,
          voice_analysis_score,
          voice_analysis_feedback,
          voice_transcription,
          voice_analysis_completed_at,
          voice_clarity_score,
          voice_pacing_score,
          voice_tone_score,
          voice_energy_score,
          voice_confidence_score,
          form_data,
          zoom_recording_url,
          zoom_recording_files,
          ghl_appointment_data,
          video_analysis_results,
          video_analysis_timestamp,
          pre_screening_responses!pre_screening_responses_application_id_fkey(
            motivation_response,
            motivation_score,
            experience_response,
            experience_score,
            availability_response,
            availability_score,
            communication_score,
            overall_prescreening_score
          ),
          candidates(
            name,
            email,
            phone,
            candidate_tags(tag)
          ),
          job_roles(
            name,
            booking_link
          )
        `)
        .in('id', applicationIds)
        .order('applied_date', { ascending: false });

      if (fullError) {
        console.error('Error fetching full application data:', fullError);
        return { data: null, error: new Error(fullError.message) };
      }

      // Transform to SafeApplication format using our internal method
      const applications: SafeApplication[] = (fullApplications || []).map(this.transformToSafeApplication);
      const totalCount = data.length > 0 ? Number(data[0].total_count) : 0;

      return { 
        data: { 
          applications, 
          totalCount 
        }, 
        error: null 
      };

    } catch (err) {
      console.error('Unexpected error in getPaginatedOptimized:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  // Get optimized stats
  static async getOptimizedStats(): Promise<DatabaseResult<any>> {
    try {
      const { data, error } = await supabase.rpc('get_application_stats');

      if (error) {
        console.error('Error in getOptimizedStats:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };

    } catch (err) {
      console.error('Unexpected error in getOptimizedStats:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  // Get summary data for quick overview
  static async getSummaryData(offset: number, limit: number): Promise<DatabaseResult<any[]>> {
    try {
      const { data, error } = await supabase.rpc('get_applications_paginated_v2', {
        p_offset: offset,
        p_limit: limit,
        p_status: null,
        p_job_role_id: null,
        p_search_term: null
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data: data || [], error: null };

    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  // Refresh materialized view (if implemented later)
  static async refreshSummaryView(): Promise<void> {
    try {
      await supabase.rpc('refresh_application_summary');
    } catch (error) {
      console.log('Materialized view refresh not available:', error);
    }
  }
}
