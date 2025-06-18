
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface JobRole {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'closed';
  form_fields: any[];
  booking_link?: string;
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
    mutationFn: async (roleData: { name: string; description: string; booking_link?: string }) => {
      const { data, error } = await supabase
        .from('job_roles')
        .insert([{
          name: roleData.name,
          description: roleData.description,
          booking_link: roleData.booking_link,
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

export const useUpdateJobRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<JobRole> & { id: string }) => {
      console.log('=== UPDATE JOB ROLE DEBUG ===');
      console.log('Updating job role with ID:', id, 'typeof:', typeof id);
      console.log('Updates:', updates);
      
      try {
        // First, get the current role data
        const { data: currentRole, error: fetchError } = await supabase
          .from('job_roles')
          .select('*')
          .eq('id', id)
          .single();
        
        if (fetchError || !currentRole) {
          console.error('Role not found:', fetchError);
          throw new Error('Role not found');
        }
        
        console.log('Current role data:', currentRole);
        
        // Build the complete updated role object
        const updatedRole = {
          ...currentRole,
          ...updates,
          updated_at: new Date().toISOString()
        };
        
        // Handle booking_link properly - empty string becomes null
        if (updates.booking_link !== undefined) {
          updatedRole.booking_link = updates.booking_link === '' ? null : updates.booking_link;
        }
        
        console.log('Complete updated role object:', updatedRole);
        
        // Use upsert instead of update for more reliability
        const { data, error } = await supabase
          .from('job_roles')
          .upsert(updatedRole, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          })
          .select()
          .single();
        
        console.log('Upsert response - data:', data, 'error:', error);
        
        if (error) {
          console.error('Supabase upsert error:', error);
          throw new Error(`Database update failed: ${error.message}`);
        }
        
        if (!data) {
          console.error('Upsert returned no data');
          throw new Error('Update operation failed');
        }
        
        console.log('Update successful, returned data:', data);
        console.log('=== UPDATE COMPLETE ===');
        return data;
        
      } catch (error) {
        console.error('=== UPDATE FAILED ===');
        console.error('Full update error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Update mutation successful:', data);
      queryClient.invalidateQueries({ queryKey: ['job-roles'] });
    },
    onError: (error) => {
      console.error('Update mutation failed:', error);
    }
  });
};
