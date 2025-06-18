
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
        // First verify the role exists with debugging
        const { data: existingRoles, error: checkError } = await supabase
          .from('job_roles')
          .select('*');
        
        console.log('All roles in database:', existingRoles?.map(r => ({ id: r.id, name: r.name })));
        
        const roleExists = existingRoles?.find(r => r.id === id);
        console.log('Role exists check:', roleExists ? 'YES' : 'NO');
        
        if (!roleExists) {
          console.error('Role not found in database with ID:', id);
          throw new Error(`Role with ID ${id} not found in database`);
        }
        
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
        
        const { data, error } = await supabase
          .from('job_roles')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) {
          console.error('Supabase update error:', error);
          throw new Error(`Database update failed: ${error.message}`);
        }
        
        if (!data) {
          console.error('No data returned from update');
          throw new Error('Update operation returned no data');
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
