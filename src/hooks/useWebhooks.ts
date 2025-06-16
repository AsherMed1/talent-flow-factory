
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type WebhookConfigRow = Database['public']['Tables']['webhook_configs']['Row'];

export interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  event_type: WebhookConfigRow['event_type'];
  is_active: boolean;
  created_at: string;
}

export const useWebhooks = () => {
  return useQuery({
    queryKey: ['webhooks'],
    queryFn: async (): Promise<WebhookConfig[]> => {
      const { data, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching webhooks:', error);
        throw error;
      }
      
      return (data || []) as WebhookConfig[];
    }
  });
};

export const useCreateWebhook = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (webhook: Omit<WebhookConfig, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('webhook_configs')
        .insert(webhook)
        .select()
        .single();
      
      if (error) throw error;
      return data;
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
