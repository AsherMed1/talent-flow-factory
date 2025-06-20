
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OptimizedApplicationService } from '@/services/database/optimizedApplicationService';

export const useSuperOptimizedApplications = (
  page: number = 1, 
  limit: number = 20,
  status?: string,
  jobRoleId?: string
) => {
  return useQuery({
    queryKey: ['super-optimized-applications', page, limit, status, jobRoleId],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const result = await OptimizedApplicationService.getPaginatedOptimized(
        offset, 
        limit, 
        status, 
        jobRoleId
      );
      if (result.error) {
        throw result.error;
      }
      return result.data || { applications: [], totalCount: 0 };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};

// Enhanced prefetching with multiple strategies
export const useEnhancedPrefetch = (
  currentPage: number, 
  limit: number = 20,
  status?: string,
  jobRoleId?: string
) => {
  const queryClient = useQueryClient();
  
  return {
    prefetchNext: () => {
      queryClient.prefetchQuery({
        queryKey: ['super-optimized-applications', currentPage + 1, limit, status, jobRoleId],
        queryFn: async () => {
          const offset = currentPage * limit;
          const result = await OptimizedApplicationService.getPaginatedOptimized(
            offset, 
            limit, 
            status, 
            jobRoleId
          );
          if (result.error) throw result.error;
          return result.data || { applications: [], totalCount: 0 };
        },
        staleTime: 2 * 60 * 1000,
      });
    },
    
    prefetchPrevious: () => {
      if (currentPage > 1) {
        queryClient.prefetchQuery({
          queryKey: ['super-optimized-applications', currentPage - 1, limit, status, jobRoleId],
          queryFn: async () => {
            const offset = (currentPage - 2) * limit;
            const result = await OptimizedApplicationService.getPaginatedOptimized(
              offset, 
              limit, 
              status, 
              jobRoleId
            );
            if (result.error) throw result.error;
            return result.data || { applications: [], totalCount: 0 };
          },
          staleTime: 2 * 60 * 1000,
        });
      }
    },

    // Prefetch summary data
    prefetchSummary: () => {
      queryClient.prefetchQuery({
        queryKey: ['application-summary', 0, 50],
        queryFn: async () => {
          const result = await OptimizedApplicationService.getSummaryData(0, 50);
          if (result.error) throw result.error;
          return result.data || [];
        },
        staleTime: 5 * 60 * 1000,
      });
    }
  };
};
