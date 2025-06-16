
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebhookPayload {
  eventType: string;
  data: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { eventType, data }: WebhookPayload = await req.json();
    console.log('Webhook trigger received:', { eventType, data });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get active webhooks for this event type
    const { data: webhooks, error: webhookError } = await supabase
      .from('webhook_configs')
      .select('*')
      .eq('event_type', eventType)
      .eq('is_active', true);

    if (webhookError) {
      console.error('Error fetching webhooks:', webhookError);
      throw webhookError;
    }

    console.log(`Found ${webhooks?.length || 0} active webhooks for event: ${eventType}`);

    // Trigger each webhook
    const results = await Promise.allSettled(
      (webhooks || []).map(async (webhook) => {
        console.log(`Triggering webhook: ${webhook.name} (${webhook.url})`);
        
        try {
          const response = await fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              eventType,
              timestamp: new Date().toISOString(),
              webhook_name: webhook.name,
              source: 'hiring-system',
              data: data
            }),
          });

          const responseText = await response.text();
          console.log(`Webhook ${webhook.name} response:`, response.status, responseText);

          return {
            webhook: webhook.name,
            status: response.status,
            success: response.ok,
            response: responseText
          };
        } catch (error) {
          console.error(`Error triggering webhook ${webhook.name}:`, error);
          return {
            webhook: webhook.name,
            status: 500,
            success: false,
            error: error.message
          };
        }
      })
    );

    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;

    console.log(`Successfully triggered ${successCount}/${results.length} webhooks`);

    return new Response(
      JSON.stringify({
        success: true,
        eventType,
        webhooksTriggered: results.length,
        successfulTriggers: successCount,
        results: results.map(result => 
          result.status === 'fulfilled' ? result.value : { error: result.reason }
        )
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in trigger-webhook function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
