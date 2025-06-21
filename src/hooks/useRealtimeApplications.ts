
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeApplications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 Setting up real-time application updates...');
    
    const channel = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        async (payload) => {
          console.log('📡 Real-time application update received:', payload);
          console.log('Event type:', payload.eventType);
          console.log('New data:', payload.new);
          console.log('Old data:', payload.old);
          
          // Invalidate all application-related queries
          const queriesToInvalidate = [
            ['applications'],
            ['application-stats'],
            ['applications', 'paginated'],
            ['super-optimized-applications']
          ];

          console.log('🔄 Invalidating queries:', queriesToInvalidate);
          
          // Invalidate and refetch all application data
          await Promise.all(
            queriesToInvalidate.map(queryKey => 
              queryClient.invalidateQueries({ queryKey })
            )
          );

          // Force refetch for immediate update
          await queryClient.refetchQueries({ queryKey: ['applications'] });
          await queryClient.refetchQueries({ queryKey: ['application-stats'] });
          
          console.log('✅ Queries invalidated and refetched');
          
          // Show toast notification for updates
          if (payload.eventType === 'UPDATE') {
            const status = payload.new?.status || 'updated';
            toast({
              title: "Application Updated",
              description: `Application status changed to ${status.replace('_', ' ')}`,
            });
            console.log('📬 Toast shown for UPDATE:', status);
          } else if (payload.eventType === 'INSERT') {
            toast({
              title: "New Application",
              description: "A new application has been submitted",
            });
            console.log('📬 Toast shown for INSERT');
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
      });

    return () => {
      console.log('🔌 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};
