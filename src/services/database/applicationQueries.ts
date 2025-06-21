
import { supabase } from '@/integrations/supabase/client';
import { DatabaseResult } from './types';

export class ApplicationQueries {
  // Get optimized paginated results using database function
  static async getPaginatedData(
    offset: number, 
    limit: number, 
    status?: string, 
    jobRoleId?: string
  ): Promise<DatabaseResult<any[]>> {
    try {
      const { data, error } = await supabase.rpc('get_applications_paginated_v2', {
        p_offset: offset,
        p_limit: limit,
        p_status: status || null,
        p_job_role_id: jobRoleId || null,
        p_search_term: null
      });

      if (error) {
        console.error('Error in getPaginatedData:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: data || [], error: null };

    } catch (err) {
      console.error('Unexpected error in getPaginatedData:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  // Get full application data for specific IDs
  static async getFullApplicationData(applicationIds: string[]): Promise<DatabaseResult<any[]>> {
    try {
      const { data, error } = await supabase
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

      if (error) {
        console.error('Error fetching full application data:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data: data || [], error: null };

    } catch (err) {
      console.error('Unexpected error in getFullApplicationData:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  // Get application statistics
  static async getStats(): Promise<DatabaseResult<any>> {
    try {
      const { data, error } = await supabase.rpc('get_application_stats');

      if (error) {
        console.error('Error in getStats:', error);
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };

    } catch (err) {
      console.error('Unexpected error in getStats:', err);
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
