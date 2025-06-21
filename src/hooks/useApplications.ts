
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApplicationService } from '@/services/database/applicationService';

// Re-export types for backward compatibility
export type { SafePreScreeningResponse as PreScreeningResponse, SafeApplication as Application } from '@/services/database/types';

export const useApplications = () => {
  // Safety check for React hooks availability
  if (!React || typeof React.useState !== 'function') {
    console.warn('React hooks not available in useApplications, returning fallback');
    return {
      data: [],
      isLoading: false,
      error: null,
      dataUpdatedAt: Date.now()
    };
  }

  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      console.log('🔍 Fetching applications...');
      const result = await ApplicationService.getAll();
      
      if (result.error) {
        console.error('❌ Error fetching applications:', result.error);
        throw result.error;
      }
      
      const applications = result.data || [];
      console.log(`✅ Fetched ${applications.length} applications`);
      console.log('Recent applications (first 3):', applications.slice(0, 3).map(app => ({
        id: app.id,
        candidateName: app.candidate?.name,
        status: app.status,
        appliedDate: app.applied_date,
        hasFormData: !!app.form_data && Object.keys(app.form_data).length > 0,
        hasCandidateId: !!app.candidate_id
      })));
      
      return applications;
    },
    staleTime: 30 * 1000, // Reduced to 30 seconds for better responsiveness
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: true, // Enable refetch on window focus
    refetchOnMount: true, // Always refetch on component mount
    retry: 1,
    // More frequent background refetch
    refetchInterval: 2 * 60 * 1000, // 2 minutes instead of 5
    refetchIntervalInBackground: true,
  });
};

export const useApplicationStats = () => {
  // Safety check for React hooks availability
  if (!React || typeof React.useState !== 'function') {
    console.warn('React hooks not available in useApplicationStats, returning fallback');
    return {
      data: null,
      isLoading: false,
      error: null
    };
  }

  return useQuery({
    queryKey: ['application-stats'],
    queryFn: async () => {
      console.log('📊 Fetching application stats...');
      const result = await ApplicationService.getStats();
      
      if (result.error) {
        console.error('❌ Error fetching application stats:', result.error);
        throw result.error;
      }
      
      console.log('✅ Application stats fetched:', result.data);
      return result.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
    // Background refetch for stats
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    refetchIntervalInBackground: true,
  });
};

// New hook for paginated applications with search
export const usePaginatedApplications = (
  page: number = 1, 
  limit: number = 20, 
  status?: string, 
  jobRoleId?: string, 
  searchTerm?: string
) => {
  // Safety check for React hooks availability
  if (!React || typeof React.useState !== 'function') {
    console.warn('React hooks not available in usePaginatedApplications, returning fallback');
    return {
      data: { applications: [], totalCount: 0 },
      isLoading: false,
      error: null
    };
  }

  return useQuery({
    queryKey: ['applications', 'paginated', page, limit, status, jobRoleId, searchTerm],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const result = await ApplicationService.getPaginatedWithSearch(
        offset, 
        limit, 
        status, 
        jobRoleId, 
        searchTerm
      );
      if (result.error) {
        throw result.error;
      }
      return result.data || { applications: [], totalCount: 0 };
    },
    staleTime: 1 * 60 * 1000, // 1 minute for paginated data
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};
