
import { supabase } from '@/integrations/supabase/client';
import { SafeApplication, DatabaseResult } from './types';
import { DataTransformers } from './transformers';

export class OptimizedApplicationService {
  // Use the new optimized database function for paginated results
  static async getPaginatedOptimized(
    offset: number, 
    limit: number, 
    status?: string, 
    jobRoleId?: string
  ): Promise<DatabaseResult<{ applications: SafeApplication[], totalCount: number }>> {
    try {
      const { data, error } = await supabase.rpc('get_applications_paginated', {
        p_offset: offset,
        p_limit: limit,
        p_status: status || null,
        p_job_role_id: jobRoleId || null
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      if (!data || data.length === 0) {
        return { data: { applications: [], totalCount: 0 }, error: null };
      }

      // Get full application data for the paginated results
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
          pre_screening_responses (
            motivation_response,
            motivation_score,
            experience_response,
            experience_score,
            availability_response,
            availability_score,
            communication_score,
            overall_prescreening_score
          ),
          candidates (
            name, 
            email, 
            phone,
            candidate_tags (tag)
          ),
          job_roles (name, booking_link)
        `)
        .in('id', applicationIds)
        .order('applied_date', { ascending: false });

      if (fullError) {
        return { data: null, error: new Error(fullError.message) };
      }

      const transformedApplications = (fullApplications || [])
        .map(app => DataTransformers.transformApplication(app));

      const totalCount = data.length > 0 ? Number(data[0].total_count) : 0;

      return { 
        data: { 
          applications: transformedApplications, 
          totalCount 
        }, 
        error: null 
      };

    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  // Use the optimized stats function
  static async getOptimizedStats(): Promise<DatabaseResult<any>> {
    try {
      const { data, error } = await supabase.rpc('get_application_stats');
      
      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };

    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  // Use materialized view for summary data
  static async getSummaryData(
    offset: number = 0, 
    limit: number = 50
  ): Promise<DatabaseResult<any[]>> {
    try {
      const { data, error } = await supabase
        .from('mv_application_summary')
        .select('*')
        .order('applied_date', { ascending: false })
        .range(offset, offset + limit - 1);

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

  // Refresh materialized view (call periodically)
  static async refreshSummaryView(): Promise<DatabaseResult<void>> {
    try {
      const { error } = await supabase.rpc('refresh_application_summary');
      
      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data: undefined, error: null };

    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }
}
