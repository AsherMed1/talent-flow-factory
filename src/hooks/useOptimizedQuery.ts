
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

// Enhanced React Query with optimized caching strategies
export const useOptimizedQuery = <T>(
  key: string[],
  queryFn: () => Promise<T>,
  options?: {
    staleTime?: number;
    gcTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    backgroundRefetch?: boolean;
    retry?: number;
  }
) => {
  const defaultOptions: UseQueryOptions<T> = {
    queryKey: key,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes default
    gcTime: 10 * 60 * 1000, // 10 minutes default
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    ...options,
  };

  // Background refetch strategy
  if (options?.backgroundRefetch) {
    defaultOptions.refetchInterval = 30 * 60 * 1000; // 30 minutes
    defaultOptions.refetchIntervalInBackground = true;
  }

  return useQuery(defaultOptions);
};

// Prefetch utility
export const usePrefetchQuery = () => {
  const { prefetchQuery } = useQuery as any;
  
  return (key: string[], queryFn: () => Promise<any>, staleTime = 5 * 60 * 1000) => {
    prefetchQuery({
      queryKey: key,
      queryFn,
      staleTime,
    });
  };
};
