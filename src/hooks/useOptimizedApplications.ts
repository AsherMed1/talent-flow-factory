
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { OptimizedApplicationService } from '@/services/database/optimizedApplicationService';

export const useOptimizedApplications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['applications', 'paginated', page, limit],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const result = await OptimizedApplicationService.getPaginatedOptimized(offset, limit);
      if (result.error) {
        throw result.error;
      }
      return result.data || { applications: [], totalCount: 0 };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes (reduced from 10)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1, // Reduced retries
  });
};

// Enhanced prefetch with database optimization
export const usePrefetchNextPage = (currentPage: number, limit: number = 20) => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['applications', 'paginated', currentPage + 1, limit],
      queryFn: async () => {
        const offset = currentPage * limit;
        const result = await OptimizedApplicationService.getPaginatedOptimized(offset, limit);
        if (result.error) {
          throw result.error;
        }
        return result.data || { applications: [], totalCount: 0 };
      },
      staleTime: 2 * 60 * 1000,
    });
  };
};

// Periodic materialized view refresh
export const useViewRefresh = () => {
  const queryClient = useQueryClient();
  
  return () => {
    OptimizedApplicationService.refreshSummaryView().then(() => {
      // Invalidate related queries after refresh
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-summary'] });
    });
  };
};
