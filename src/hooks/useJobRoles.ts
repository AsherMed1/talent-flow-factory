
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Comprehensive React availability check
if (!React || !React.useState) {
  console.error('React is not available in useJobRoles');
  throw new Error('React hooks are not available. Please check React setup.');
}

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
  // Safety check for React hooks availability
  if (!React || typeof React.useState !== 'function' || typeof React.useContext !== 'function') {
    console.warn('React hooks not available in useJobRoles, returning fallback');
    return {
      data: [
        {
          id: 'fallback-role',
          name: 'Loading...',
          description: 'Please wait while we load job roles',
          status: 'active' as const,
          form_fields: [],
          pipeline_stages: [
            {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
            {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
            {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
            {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
            {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
            {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
          ],
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        } as JobRole
      ],
      isLoading: false,
      error: null
    };
  }

  console.log('useJobRoles hook called - React availability:', {
    React: typeof React,
    useState: typeof React?.useState,
    useQuery: typeof useQuery
  });

  return useQuery({
    queryKey: ['job-roles'],
    queryFn: async () => {
      console.log('useJobRoles queryFn executing...');
      const { data, error } = await supabase
        .from('job_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('useJobRoles query error:', error);
        throw error;
      }
      
      console.log('useJobRoles query success, data:', data);
      
      // Transform the data to ensure pipeline_stages is properly typed
      return data.map(role => ({
        ...role,
        pipeline_stages: (role.pipeline_stages as unknown as PipelineStage[]) || [
          {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
          {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
          {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
          {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
          {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
          {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
        ]
      })) as JobRole[];
    }
  });
};

export const useCreateJobRole = () => {
  // Safety check for React hooks availability
  if (!React || typeof React.useState !== 'function' || typeof React.useContext !== 'function') {
    console.warn('React hooks not available in useCreateJobRole, returning fallback');
    return {
      mutate: () => {},
      mutateAsync: async () => ({ id: 'fallback', name: 'Fallback Role' }),
      isPending: false,
      error: null
    };
  }

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
        .insert({
          name: roleData.name,
          description: roleData.description,
          booking_link: roleData.booking_link,
          hiring_process: roleData.hiring_process,
          screening_questions: roleData.screening_questions,
          job_description: roleData.job_description,
          ai_tone_prompt: roleData.ai_tone_prompt,
          pipeline_stages: (roleData.pipeline_stages || [
            {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
            {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
            {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
            {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
            {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
            {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
          ]) as any,
          status: 'draft' as const
        })
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
  // Safety check for React hooks availability
  if (!React || typeof React.useState !== 'function' || typeof React.useContext !== 'function') {
    console.warn('React hooks not available in useUpdateJobRole, returning fallback');
    return {
      mutate: () => {},
      mutateAsync: async () => ({ id: 'fallback', name: 'Fallback Role' }),
      isPending: false,
      error: null
    };
  }

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
