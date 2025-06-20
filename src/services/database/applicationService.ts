
import { supabase } from '@/integrations/supabase/client';
import { SafeApplication, DatabaseResult } from './types';
import { DataTransformers } from './transformers';

export class ApplicationService {
  static async getAll(): Promise<DatabaseResult<SafeApplication[]>> {
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
        .not('form_data', 'is', null)
        .neq('form_data', '{}')
        .not('candidate_id', 'is', null)
        .order('applied_date', { ascending: false });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      // Filter and transform data safely
      const validApplications = (data || [])
        .filter(app => {
          if (!app.form_data) return false;
          const formData = app.form_data as any;
          return (
            formData.basicInfo || 
            formData.availability || 
            formData.preScreening ||
            formData.voiceRecordings || 
            formData.listeningComprehension || 
            formData.uploads
          );
        })
        .map(app => DataTransformers.transformApplication(app));

      return { data: validApplications, error: null };

    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  static async getPaginated(offset: number, limit: number): Promise<DatabaseResult<{ applications: SafeApplication[], totalCount: number }>> {
    try {
      // Get total count first
      const { count, error: countError } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .not('form_data', 'is', null)
        .neq('form_data', '{}')
        .not('candidate_id', 'is', null);

      if (countError) {
        return { data: null, error: new Error(countError.message) };
      }

      // Get paginated data
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
        .not('form_data', 'is', null)
        .neq('form_data', '{}')
        .not('candidate_id', 'is', null)
        .order('applied_date', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      // Filter and transform data safely
      const validApplications = (data || [])
        .filter(app => {
          if (!app.form_data) return false;
          const formData = app.form_data as any;
          return (
            formData.basicInfo || 
            formData.availability || 
            formData.preScreening ||
            formData.voiceRecordings || 
            formData.listeningComprehension || 
            formData.uploads
          );
        })
        .map(app => DataTransformers.transformApplication(app));

      return { 
        data: { 
          applications: validApplications, 
          totalCount: count || 0 
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

  static async getStats(): Promise<DatabaseResult<any>> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('status, applied_date, interview_date, form_data')
        .not('form_data', 'is', null)
        .neq('form_data', '{}')
        .not('candidate_id', 'is', null);
      
      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      // Filter to only include applications with proper form structure
      const filteredData = (data || []).filter(app => {
        if (!app.form_data) return false;
        const formData = app.form_data as any;
        return (
          formData.basicInfo || 
          formData.availability || 
          formData.preScreening ||
          formData.voiceRecordings || 
          formData.listeningComprehension || 
          formData.uploads
        );
      });
      
      const stats = {
        activeApplications: filteredData.filter(app => !['hired', 'rejected'].includes(app.status)).length,
        interviewsThisWeek: filteredData.filter(app => {
          if (!app.interview_date) return false;
          const interviewDate = new Date(app.interview_date);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return interviewDate >= oneWeekAgo;
        }).length,
        hiredThisMonth: filteredData.filter(app => {
          if (app.status !== 'hired') return false;
          const appliedDate = new Date(app.applied_date);
          const oneMonthAgo = new Date();
          oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
          return appliedDate >= oneMonthAgo;
        }).length,
        conversionRate: filteredData.length > 0 ? ((filteredData.filter(app => app.status === 'hired').length / filteredData.length) * 100).toFixed(1) : '0'
      };
      
      return { data: stats, error: null };

    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }
}
