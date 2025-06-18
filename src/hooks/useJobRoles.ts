
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
        // Build the update object with only the fields that are being updated
        const updateData: any = {
          updated_at: new Date().toISOString()
        };
        
        if (updates.name !== undefined) {
          updateData.name = updates.name;
        }
        if (updates.description !== undefined) {
          updateData.description = updates.description;
        }
        if (updates.booking_link !== undefined) {
          // Handle booking_link properly - empty string becomes null
          updateData.booking_link = updates.booking_link === '' ? null : updates.booking_link;
        }
        
        console.log('Final update data being sent to Supabase:', updateData);
        
        // Use a more robust update approach
        const { data, error, count } = await supabase
          .from('job_roles')
          .update(updateData)
          .eq('id', id)
          .select('*');
        
        console.log('Update response - data:', data, 'error:', error, 'count:', count);
        
        if (error) {
          console.error('Supabase update error:', error);
          throw new Error(`Database update failed: ${error.message}`);
        }
        
        if (!data || data.length === 0) {
          console.error('Update returned no data - role may not exist');
          // Let's verify the role exists
          const { data: checkData } = await supabase
            .from('job_roles')
            .select('id, name')
            .eq('id', id);
          console.log('Role exists check after failed update:', checkData);
          throw new Error('Role not found or update failed');
        }
        
        const updatedRole = data[0];
        console.log('Update successful, returned data:', updatedRole);
        console.log('=== UPDATE COMPLETE ===');
        return updatedRole;
        
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
