
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  applications: {
    id: string;
    status: 'applied' | 'reviewed' | 'interview_scheduled' | 'interview_completed' | 'offer_sent' | 'hired' | 'rejected';
    rating: number | null;
    notes: string | null;
    applied_date: string;
    voice_analysis_score: number | null;
    job_roles: {
      name: string;
    } | null;
    pre_screening_responses?: Array<{
      motivation_response: string;
      motivation_score: number;
      experience_response: string;
      experience_score: number;
      availability_response: string;
      availability_score: number;
      communication_score: number;
      overall_prescreening_score: number;
    }>;
  }[];
  candidate_tags: {
    tag: string;
  }[];
}

export const useCandidates = () => {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
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
      
      if (error) throw error;
      
      // Transform data to handle potential foreign key errors
      const transformedData = data?.map(candidate => ({
        ...candidate,
        applications: candidate.applications?.map(app => {
          // Handle job_roles with proper null checking
          let validJobRoles = null;
          const jobRolesData = app.job_roles;
          if (jobRolesData !== null && 
              typeof jobRolesData === 'object' && 
              'name' in jobRolesData && 
              typeof jobRolesData.name === 'string' &&
              !('error' in jobRolesData)) {
            validJobRoles = {
              name: jobRolesData.name
            };
          }

          return {
            ...app,
            job_roles: validJobRoles
          };
        }) || []
      })) || [];
      
      return transformedData as Candidate[];
    }
  });
};
