
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ZoomWebhookPayload {
  event: string;
  payload: {
    account_id: string;
    object: {
      uuid: string;
      id: number;
      host_id: string;
      topic: string;
      type: number;
      start_time: string;
      timezone: string;
      duration: number;
      total_size: number;
      recording_count: number;
      share_url: string;
      recording_files: Array<{
        id: string;
        meeting_id: string;
        recording_start: string;
        recording_end: string;
        file_type: string;
        file_size: number;
        play_url: string;
        download_url: string;
      }>;
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log('Zoom webhook request received:', req.method, req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle HEAD requests for URL validation (Zoom uses this to validate webhook URLs)
  if (req.method === 'HEAD') {
    console.log('HEAD request for URL validation');
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  // Handle GET requests for URL validation (some services use this)
  if (req.method === 'GET') {
    console.log('GET request for URL validation');
    return new Response('Zoom webhook endpoint is active', { 
      status: 200, 
      headers: {
        'Content-Type': 'text/plain',
        ...corsHeaders,
      }
    });
  }

  // Only process POST requests for actual webhook events
  if (req.method !== 'POST') {
    console.log('Unsupported method:', req.method);
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    console.log('Processing POST webhook request');
    
    // Verify webhook authenticity using secret token
    const webhookSecret = Deno.env.get('ZOOM_WEBHOOK_SECRET_TOKEN');
    if (!webhookSecret) {
      console.error('ZOOM_WEBHOOK_SECRET_TOKEN not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return new Response('Unauthorized', { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== webhookSecret) {
      console.error('Invalid webhook secret token');
      return new Response('Unauthorized', { status: 401 });
    }

    const payload: ZoomWebhookPayload = await req.json();
    console.log('Webhook payload:', JSON.stringify(payload, null, 2));

    // Only process recording.completed events
    if (payload.event !== 'recording.completed') {
      console.log('Ignoring non-recording event:', payload.event);
      return new Response('Event ignored', { status: 200, headers: corsHeaders });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const meetingData = payload.payload.object;
    
    // Extract recording URLs
    const recordingUrls = meetingData.recording_files
      .filter(file => file.file_type === 'MP4' || file.file_type === 'M4A')
      .map(file => ({
        type: file.file_type,
        play_url: file.play_url,
        download_url: file.download_url,
        recording_start: file.recording_start,
        recording_end: file.recording_end
      }));

    console.log('Processing meeting:', meetingData.topic, 'with', recordingUrls.length, 'recordings');

    // Try to find the application by matching the meeting topic with candidate name or interview details
    // This assumes the Zoom meeting topic contains the candidate's name or some identifier
    const { data: applications, error: searchError } = await supabase
      .from('applications')
      .select(`
        id,
        candidates (name),
        interview_date
      `)
      .eq('status', 'interview_scheduled')
      .not('interview_date', 'is', null);

    if (searchError) {
      console.error('Error searching applications:', searchError);
      throw searchError;
    }

    let matchedApplication = null;

    // Try to match by candidate name in meeting topic
    if (applications && applications.length > 0) {
      for (const app of applications) {
        const candidateName = app.candidates?.name?.toLowerCase();
        const meetingTopic = meetingData.topic.toLowerCase();
        
        if (candidateName && meetingTopic.includes(candidateName)) {
          matchedApplication = app;
          break;
        }
      }
    }

    if (matchedApplication) {
      console.log('Found matching application for candidate:', matchedApplication.candidates?.name);
      
      // Update the application with recording information
      const { error: updateError } = await supabase
        .from('applications')
        .update({
          zoom_recording_url: meetingData.share_url,
          zoom_recording_files: recordingUrls,
          status: 'interview_completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', matchedApplication.id);

      if (updateError) {
        console.error('Error updating application:', updateError);
        throw updateError;
      }

      console.log('Successfully updated application with recording data');
    } else {
      console.log('No matching application found for meeting:', meetingData.topic);
      
      // Log the unmatched recording for manual review
      const { error: logError } = await supabase
        .from('zoom_recordings_log')
        .insert({
          meeting_id: meetingData.id.toString(),
          meeting_uuid: meetingData.uuid,
          topic: meetingData.topic,
          start_time: meetingData.start_time,
          share_url: meetingData.share_url,
          recording_files: recordingUrls,
          processed: false
        });

      if (logError) {
        console.error('Error logging unmatched recording:', logError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        matched: !!matchedApplication 
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
    console.error('Error in zoom-webhook function:', error);
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
