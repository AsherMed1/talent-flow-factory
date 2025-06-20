
import { useQuery } from '@tanstack/react-query';
import { ApplicationService } from '@/services/database/applicationService';

export const useOptimizedApplications = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['applications', 'paginated', page, limit],
    queryFn: async () => {
      const offset = (page - 1) * limit;
      const result = await ApplicationService.getPaginated(offset, limit);
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

// Prefetch next page for better UX
export const usePrefetchNextPage = (currentPage: number, limit: number = 20) => {
  const queryClient = useQuery.getQueryClient();
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: ['applications', 'paginated', currentPage + 1, limit],
      queryFn: async () => {
        const offset = currentPage * limit;
        const result = await ApplicationService.getPaginated(offset, limit);
        if (result.error) {
          throw result.error;
        }
        return result.data || { applications: [], totalCount: 0 };
      },
      staleTime: 2 * 60 * 1000,
    });
  };
};
