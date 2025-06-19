
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PipelineStage {
  name: string;
  displayName: string;
  color: string;
}

export interface JobRole {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'closed';
  form_fields: any[];
  booking_link?: string;
  hiring_process?: string;
  screening_questions?: string;
  job_description?: string;
  ai_tone_prompt?: string;
  pipeline_stages?: PipelineStage[];
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
    mutationFn: async (roleData: { 
      name: string; 
      description: string; 
      booking_link?: string;
      hiring_process?: string;
      screening_questions?: string;
      job_description?: string;
      ai_tone_prompt?: string;
      pipeline_stages?: PipelineStage[];
    }) => {
      const { data, error } = await supabase
        .from('job_roles')
        .insert([{
          name: roleData.name,
          description: roleData.description,
          booking_link: roleData.booking_link,
          hiring_process: roleData.hiring_process,
          screening_questions: roleData.screening_questions,
          job_description: roleData.job_description,
          ai_tone_prompt: roleData.ai_tone_prompt,
          pipeline_stages: roleData.pipeline_stages || [
            {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
            {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
            {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
            {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
            {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
            {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
          ],
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
      console.log('Updating job role with ID:', id);
      console.log('Updates:', updates);
      
      // Build the update object
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
        updateData.booking_link = updates.booking_link === '' ? null : updates.booking_link;
      }
      if (updates.hiring_process !== undefined) {
        updateData.hiring_process = updates.hiring_process === '' ? null : updates.hiring_process;
      }
      if (updates.screening_questions !== undefined) {
        updateData.screening_questions = updates.screening_questions === '' ? null : updates.screening_questions;
      }
      if (updates.job_description !== undefined) {
        updateData.job_description = updates.job_description === '' ? null : updates.job_description;
      }
      if (updates.ai_tone_prompt !== undefined) {
        updateData.ai_tone_prompt = updates.ai_tone_prompt === '' ? null : updates.ai_tone_prompt;
      }
      if (updates.pipeline_stages !== undefined) {
        updateData.pipeline_stages = updates.pipeline_stages;
      }
      
      console.log('Update data:', updateData);
      
      const { data, error } = await supabase
        .from('job_roles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      console.log('Update response - data:', data, 'error:', error);
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('Update operation failed - no data returned');
      }
      
      console.log('Update successful:', data);
      console.log('=== UPDATE COMPLETE ===');
      return data;
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
