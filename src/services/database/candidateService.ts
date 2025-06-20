
import { supabase } from '@/integrations/supabase/client';
import { SafeCandidate, DatabaseResult } from './types';
import { DataTransformers } from './transformers';

export class CandidateService {
  static async getAll(): Promise<DatabaseResult<SafeCandidate[]>> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select(`
          *,
          applications (
            id,
            status,
            rating,
            notes,
            applied_date,
            voice_analysis_score,
            job_roles (name),
            pre_screening_responses (
              motivation_response,
              motivation_score,
              experience_response,
              experience_score,
              availability_response,
              availability_score,
              communication_score,
              overall_prescreening_score
            )
          ),
          candidate_tags (tag)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      const transformedData = (data || []).map(candidate => 
        DataTransformers.transformCandidate(candidate)
      );
      
      return { data: transformedData, error: null };

    } catch (err) {
      return { 
        data: null, 
        error: err instanceof Error ? err : new Error('Unknown error occurred') 
      };
    }
  }
}
