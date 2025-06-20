
import { useQuery } from '@tanstack/react-query';
import { OptimizedApplicationService } from '@/services/database/optimizedApplicationService';

export const useOptimizedStats = () => {
  return useQuery({
    queryKey: ['optimized-application-stats'],
    queryFn: async () => {
      const result = await OptimizedApplicationService.getOptimizedStats();
      if (result.error) {
        throw result.error;
      }
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change frequently
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    // Background refetch for fresh stats
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    refetchIntervalInBackground: true,
  });
};
