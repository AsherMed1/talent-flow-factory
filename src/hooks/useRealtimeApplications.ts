
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeApplications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
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
          console.log('Real-time application update:', payload);
          
          // Invalidate and refetch applications data
          await queryClient.invalidateQueries({ queryKey: ['applications'] });
          
          // Show toast notification for updates
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Application Updated",
              description: `Application status changed to ${payload.new?.status || 'updated'}`,
            });
          } else if (payload.eventType === 'INSERT') {
            toast({
              title: "New Application",
              description: "A new application has been submitted",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};
