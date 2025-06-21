
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

  // Get full application data with proper joins instead of nested selects
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
          video_analysis_timestamp
        `)
        .in('id', applicationIds)
        .order('applied_date', { ascending: false });

      if (error) {
        console.error('Error fetching application data:', error);
        return { data: null, error: new Error(error.message) };
      }

      // Now fetch related data separately to avoid relationship issues
      const applications = data || [];
      const candidateIds = [...new Set(applications.map(app => app.candidate_id).filter(Boolean))];
      const jobRoleIds = [...new Set(applications.map(app => app.job_role_id).filter(Boolean))];

      // Fetch candidates
      const { data: candidates } = await supabase
        .from('candidates')
        .select('id, name, email, phone')
        .in('id', candidateIds);

      // Fetch job roles
      const { data: jobRoles } = await supabase
        .from('job_roles')
        .select('id, name, booking_link')
        .in('id', jobRoleIds);

      // Fetch candidate tags
      const { data: candidateTags } = await supabase
        .from('candidate_tags')
        .select('candidate_id, tag')
        .in('candidate_id', candidateIds);

      // Fetch pre-screening responses
      const { data: preScreeningResponses } = await supabase
        .from('pre_screening_responses')
        .select(`
          application_id,
          motivation_response,
          motivation_score,
          experience_response,
          experience_score,
          availability_response,
          availability_score,
          communication_score,
          overall_prescreening_score
        `)
        .in('application_id', applicationIds);

      // Combine the data
      const enrichedApplications = applications.map(app => {
        const candidate = candidates?.find(c => c.id === app.candidate_id);
        const jobRole = jobRoles?.find(jr => jr.id === app.job_role_id);
        const tags = candidateTags?.filter(ct => ct.candidate_id === app.candidate_id) || [];
        const preScreening = preScreeningResponses?.filter(psr => psr.application_id === app.id) || [];

        return {
          ...app,
          candidates: candidate || null,
          job_roles: jobRole || null,
          candidate_tags: tags,
          pre_screening_responses: preScreening
        };
      });

      return { data: enrichedApplications, error: null };

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

  // Get all applications with proper joins
  static async getAllApplications(): Promise<DatabaseResult<any[]>> {
    try {
      // First get basic application data
      const { data: applications, error: appsError } = await supabase
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
          video_analysis_timestamp
        `)
        .not('form_data', 'is', null)
        .neq('form_data', '{}')
        .not('candidate_id', 'is', null)
        .order('applied_date', { ascending: false });

      if (appsError) {
        console.error('Error fetching applications:', appsError);
        return { data: null, error: new Error(appsError.message) };
      }

      if (!applications || applications.length === 0) {
        return { data: [], error: null };
      }

      // Get unique IDs for related data
      const candidateIds = [...new Set(applications.map(app => app.candidate_id).filter(Boolean))];
      const jobRoleIds = [...new Set(applications.map(app => app.job_role_id).filter(Boolean))];
      const applicationIds = applications.map(app => app.id);

      // Fetch related data in parallel
      const [candidatesResult, jobRolesResult, candidateTagsResult, preScreeningResult] = await Promise.all([
        supabase.from('candidates').select('id, name, email, phone').in('id', candidateIds),
        supabase.from('job_roles').select('id, name, booking_link').in('id', jobRoleIds),
        supabase.from('candidate_tags').select('candidate_id, tag').in('candidate_id', candidateIds),
        supabase.from('pre_screening_responses').select(`
          application_id,
          motivation_response,
          motivation_score,
          experience_response,
          experience_score,
          availability_response,
          availability_score,
          communication_score,
          overall_prescreening_score
        `).in('application_id', applicationIds)
      ]);

      // Combine the data
      const enrichedApplications = applications.map(app => {
        const candidate = candidatesResult.data?.find(c => c.id === app.candidate_id);
        const jobRole = jobRolesResult.data?.find(jr => jr.id === app.job_role_id);
        const tags = candidateTagsResult.data?.filter(ct => ct.candidate_id === app.candidate_id) || [];
        const preScreening = preScreeningResult.data?.filter(psr => psr.application_id === app.id) || [];

        return {
          ...app,
          candidates: candidate || null,
          job_roles: jobRole || null,
          candidate_tags: tags,
          pre_screening_responses: preScreening
        };
      });

      return { data: enrichedApplications, error: null };

    } catch (err) {
      console.error('Unexpected error in getAllApplications:', err);
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
