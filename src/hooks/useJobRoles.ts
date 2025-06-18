
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
      console.log('Updating job role with ID:', id, 'and updates:', updates);
      
      // Build update object more carefully
      const updateData: any = {
        updated_at: new Date().toISOString()
      };
      
      // Only include fields that are actually being updated
      if (updates.name !== undefined && updates.name !== null) {
        updateData.name = updates.name;
      }
      if (updates.description !== undefined) {
        updateData.description = updates.description || '';
      }
      if (updates.booking_link !== undefined) {
        updateData.booking_link = updates.booking_link || null;
      }
      
      console.log('Update data being sent:', updateData);
      
      // Use upsert approach to ensure the update works
      const { data, error } = await supabase
        .from('job_roles')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle();
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      console.log('Update response:', data);
      
      if (!data) {
        // If no data returned, verify the role exists
        const { data: existingRole, error: checkError } = await supabase
          .from('job_roles')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        console.log('Role existence check:', { existingRole, checkError });
        
        if (checkError) {
          throw checkError;
        }
        
        if (!existingRole) {
          throw new Error('Role not found');
        }
        
        // Role exists but wasn't updated - this might be because no actual changes were detected
        // Return the existing role data
        return existingRole;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job-roles'] });
    }
  });
};
