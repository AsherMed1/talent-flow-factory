
import { supabase } from '@/integrations/supabase/client';
import { SafeApplication, DatabaseResult } from './types';
import { OptimizedApplicationService } from './optimizedApplicationService';

export class ApplicationService {
  // Enhanced getAll with better error handling and service worker support
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

      // Use the optimized service which now uses proper joins
      const result = await OptimizedApplicationService.getAll();
      if (result.error) {
        throw result.error;
      }

      const applications = result.data || [];

      // Cache the result in service worker if available
      if ('serviceWorker' in navigator && 'caches' in window) {
        try {
          const cache = await caches.open('api-v1');
          await cache.put('/api/applications', new Response(JSON.stringify(applications), {
            headers: { 'Content-Type': 'application/json' }
          }));
        } catch (cacheError) {
          console.log('Failed to cache application data:', cacheError);
        }
      }

      return { data: applications, error: null };

    } catch (err) {
      console.error('Unexpected error in ApplicationService.getAll:', err);
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('An unexpected error occurred while fetching applications') 
      };
    }
  }

  // Background refresh for cached data with error handling
  private static async backgroundRefresh() {
    try {
      // Fetch fresh data without blocking the UI
      setTimeout(async () => {
        try {
          const freshData = await this.getAll();
          if (freshData.data && 'serviceWorker' in navigator && 'caches' in window) {
            const cache = await caches.open('api-v1');
            await cache.put('/api/applications', new Response(JSON.stringify(freshData.data), {
              headers: { 'Content-Type': 'application/json' }
            }));
          }
        } catch (refreshError) {
          console.log('Background refresh failed:', refreshError);
        }
      }, 100);
    } catch (error) {
      console.log('Background refresh setup failed:', error);
    }
  }

  // Use optimized database function for pagination with error handling
  static async getPaginated(offset: number, limit: number): Promise<DatabaseResult<{ applications: SafeApplication[], totalCount: number }>> {
    try {
      return await OptimizedApplicationService.getPaginatedOptimized(offset, limit);
    } catch (error) {
      console.error('Error in getPaginated:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to fetch paginated applications')
      };
    }
  }

  // Use optimized stats function with error handling
  static async getStats(): Promise<DatabaseResult<any>> {
    try {
      return await OptimizedApplicationService.getOptimizedStats();
    } catch (error) {
      console.error('Error in getStats:', error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to fetch application statistics')
      };
    }
  }

  // New method using the enhanced database function with search
  static async getPaginatedWithSearch(
    offset: number, 
    limit: number, 
    status?: string, 
    jobRoleId?: string, 
    searchTerm?: string
  ): Promise<DatabaseResult<{ applications: SafeApplication[], totalCount: number }>> {
    try {
      const { data, error } = await supabase.rpc('get_applications_paginated_v2', {
        p_offset: offset,
        p_limit: limit,
        p_status: status || null,
        p_job_role_id: jobRoleId || null,
        p_search_term: searchTerm || null
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      if (!data || data.length === 0) {
        return { data: { applications: [], totalCount: 0 }, error: null };
      }

      // Transform the flat results into SafeApplication objects
      const applications: SafeApplication[] = data.map((item: any) => ({
        id: item.id,
        candidate_id: item.candidate_id,
        job_role_id: item.job_role_id,
        status: item.status,
        rating: item.rating,
        applied_date: item.applied_date,
        voice_analysis_score: item.voice_analysis_score,
        // Simplified structure from the optimized query
        candidate: {
          name: item.candidate_name || 'Unknown',
          email: item.candidate_email || '',
          phone: null,
          candidate_tags: []
        },
        job_role: {
          name: item.job_role_name || 'Unknown Position',
          booking_link: null
        },
        // Default values for fields not in the optimized query
        notes: null,
        has_resume: false,
        has_voice_recording: item.voice_analysis_score ? true : false,
        has_video: false,
        interview_date: null,
        interview_recording_link: null,
        offer_sent_date: null,
        updated_at: null,
        voice_analysis_feedback: null,
        voice_transcription: null,
        voice_analysis_completed_at: null,
        voice_clarity_score: null,
        voice_pacing_score: null,
        voice_tone_score: null,
        voice_energy_score: null,
        voice_confidence_score: null,
        form_data: {},
        zoom_recording_url: null,
        zoom_recording_files: null,
        ghl_appointment_data: null,
        video_analysis_results: null,
        video_analysis_timestamp: null,
        pre_screening_responses: []
      }));

      const totalCount = data.length > 0 ? Number(data[0].total_count) : 0;

      return { 
        data: { 
          applications, 
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
}
