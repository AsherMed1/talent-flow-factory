
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface JobRole {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'closed';
  form_fields: any[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const useJobRoles = () => {
  return useQuery({
    queryKey: ['job-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as JobRole[];
    }
  });
};

export const useCreateJobRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (roleData: { name: string; description: string }) => {
      const { data, error } = await supabase
        .from('job_roles')
        .insert([{
          name: roleData.name,
          description: roleData.description,
          status: 'draft' as const
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-roles'] });
    }
  });
};
