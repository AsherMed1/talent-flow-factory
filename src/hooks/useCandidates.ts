
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
    job_roles: {
      name: string;
    };
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
            job_roles (name)
          ),
          candidate_tags (tag)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Candidate[];
    }
  });
};
