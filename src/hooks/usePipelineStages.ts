
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PipelineStage } from './useJobRoles';

export const usePipelineStages = (roleId?: string) => {
  // Safety check for React hooks availability
  if (!React || typeof React.useState !== 'function') {
    console.warn('React hooks not available in usePipelineStages, returning fallback');
    return {
      data: [
        {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
        {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
        {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
        {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
        {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
        {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
      ] as PipelineStage[],
      isLoading: false,
      error: null
    };
  }

  return useQuery({
    queryKey: ['pipeline-stages', roleId],
    queryFn: async () => {
      if (!roleId) {
        // Return default stages if no role specified
        return [
          {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
          {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
          {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
          {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
          {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
          {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
        ] as PipelineStage[];
      }

      const { data, error } = await supabase.rpc('get_pipeline_stages_for_role', {
        role_id: roleId
      });
      
      if (error) {
        console.error('Error fetching pipeline stages:', error);
        throw error;
      }
      
      // Safely cast the JSON response to PipelineStage[]
      return (data as unknown) as PipelineStage[];
    },
    enabled: true // Always enabled since we have fallback
  });
};
