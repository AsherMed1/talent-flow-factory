
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  event_type: 'application_submitted' | 'status_changed' | 'interview_scheduled' | 'offer_sent' | 'candidate_hired' | 'candidate_rejected';
  is_active: boolean;
  created_at: string;
}

export const useWebhooks = () => {
  return useQuery({
    queryKey: ['webhooks'],
    queryFn: async (): Promise<WebhookConfig[]> => {
      try {
        const { data, error } = await supabase
          .from('webhook_configs' as any)
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          // If table doesn't exist, return empty array
          if (error.message.includes('relation "public.webhook_configs" does not exist')) {
            console.log('webhook_configs table does not exist yet');
            return [];
          }
          throw error;
        }
        return (data || []) as WebhookConfig[];
      } catch (error) {
        console.error('Error fetching webhooks:', error);
        return [];
      }
    }
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (webhook: Omit<WebhookConfig, 'id' | 'created_at'>) => {
      try {
        const { data, error } = await supabase
          .from('webhook_configs' as any)
          .insert(webhook)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } catch (error: any) {
        if (error.message?.includes('relation "public.webhook_configs" does not exist')) {
          throw new Error('Please run the database migration first to create the webhook_configs table.');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: "Webhook Created",
        description: "Your Make.com webhook has been configured successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create webhook configuration.",
        variant: "destructive",
      });
    }
  });
};

export const useTriggerWebhook = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ eventType, data }: { eventType: string; data: any }) => {
      console.log('Triggering webhook for event:', eventType, data);
      
      const { data: result, error } = await supabase.functions.invoke('trigger-webhook', {
        body: { eventType, data }
      });
      
      if (error) throw error;
      return result;
    },
    onError: (error) => {
      console.error('Webhook trigger error:', error);
      toast({
        title: "Webhook Error",
        description: "Failed to trigger Make.com webhook. Please check your configuration.",
        variant: "destructive",
      });
    }
  });
};
