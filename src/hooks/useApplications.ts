
import { useQuery } from '@tanstack/react-query';
import { ApplicationService } from '@/services/database/applicationService';

// Re-export types for backward compatibility
export type { SafePreScreeningResponse as PreScreeningResponse, SafeApplication as Application } from '@/services/database/types';

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const result = await ApplicationService.getAll();
      if (result.error) {
        throw result.error;
      }
      return result.data || [];
    },
    staleTime: 2 * 60 * 1000, // Reduced to 2 minutes for better responsiveness
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    // Background refetch for fresh data
    refetchInterval: 5 * 60 * 1000, // 5 minutes - more frequent updates
    refetchIntervalInBackground: true,
  });
};

export const useApplicationStats = () => {
  return useQuery({
    queryKey: ['application-stats'],
    queryFn: async () => {
      const result = await ApplicationService.getStats();
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - stats change less frequently
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    // Background refetch for stats
    refetchInterval: 10 * 60 * 1000, // 10 minutes
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
