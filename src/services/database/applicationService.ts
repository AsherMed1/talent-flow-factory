import { supabase } from '@/integrations/supabase/client';
import { SafeApplication, DatabaseResult } from './types';
import { DataTransformers } from './transformers';

export class ApplicationService {
  // Enhanced getAll with service worker support
  static async getAll(): Promise<DatabaseResult<SafeApplication[]>> {
    try {
      // Check if we have cached data in service worker first
      if ('serviceWorker' in navigator && 'caches' in window) {
        try {
          const cache = await caches.open('api-v1');
          const cachedResponse = await cache.match('/api/applications');
          if (cachedResponse) {
            const cachedData = await cachedResponse.json();
            console.log('Using cached application data');
            // Return cached data but still fetch fresh data in background
            this.backgroundRefresh();
            return { data: cachedData, error: null };
          }
        } catch (cacheError) {
          console.log('Cache not available, fetching fresh data');
        }
      }

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

      // Cache the result in service worker if available
      if ('serviceWorker' in navigator && 'caches' in window) {
        try {
          const cache = await caches.open('api-v1');
          await cache.put('/api/applications', new Response(JSON.stringify(validApplications), {
            headers: { 'Content-Type': 'application/json' }
          }));
        } catch (cacheError) {
          console.log('Failed to cache application data:', cacheError);
        }
      }

      return { data: validApplications, error: null };

    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }

  // Background refresh for cached data
  private static async backgroundRefresh() {
    try {
      // Fetch fresh data without blocking the UI
      setTimeout(async () => {
        const freshData = await this.getAll();
        if (freshData.data && 'serviceWorker' in navigator && 'caches' in window) {
          const cache = await caches.open('api-v1');
          await cache.put('/api/applications', new Response(JSON.stringify(freshData.data), {
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      }, 100);
    } catch (error) {
      console.log('Background refresh failed:', error);
    }
  }

  // Use optimized database function for pagination
  static async getPaginated(offset: number, limit: number): Promise<DatabaseResult<{ applications: SafeApplication[], totalCount: number }>> {
    // Delegate to optimized service
    return OptimizedApplicationService.getPaginatedOptimized(offset, limit);
  }

  // Use optimized stats function
  static async getStats(): Promise<DatabaseResult<any>> {
    // Delegate to optimized service  
    return OptimizedApplicationService.getOptimizedStats();
  }
}
