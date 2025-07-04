
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

interface ZoomChallengePayload {
  event: string;
  payload: {
    plainToken: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log('=== Zoom Webhook Handler Started ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  // Handle HEAD requests for URL validation
  if (req.method === 'HEAD') {
    console.log('HEAD request for URL validation');
    return new Response(null, { 
      status: 200, 
      headers: corsHeaders 
    });
  }

  // Handle GET requests for URL validation (browser access)
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
    
    let payload;
    try {
      const body = await req.text();
      console.log('Raw request body:', body);
      payload = JSON.parse(body);
      console.log('Parsed webhook payload:', JSON.stringify(payload, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON payload' 
      }), { 
        status: 400, 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      });
    }

    // Handle Zoom's endpoint URL validation challenge
    if (payload.event === 'endpoint.url_validation') {
      console.log('=== URL Validation Challenge ===');
      const challengePayload = payload as ZoomChallengePayload;
      const plainToken = challengePayload.payload?.plainToken;
      
      console.log('Plain token received:', plainToken);
      
      if (!plainToken) {
        console.error('No plainToken found in validation payload');
        return new Response(JSON.stringify({ 
          error: 'No plainToken found in validation payload' 
        }), { 
          status: 400, 
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        });
      }
      
      // Get the secret token from environment
      const secretToken = Deno.env.get('ZOOM_WEBHOOK_SECRET_TOKEN');
      console.log('Secret token configured:', !!secretToken);
      console.log('Secret token length:', secretToken?.length || 0);
      
      if (!secretToken) {
        console.error('ZOOM_WEBHOOK_SECRET_TOKEN not configured');
        return new Response(JSON.stringify({ 
          error: 'Server configuration error - secret token not set' 
        }), { 
          status: 500, 
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        });
      }
      
      // Create the encrypted token by hashing plainToken + secretToken
      const message = plainToken + secretToken;
      console.log('Creating hash from message (length):', message.length);
      console.log('Plain token:', plainToken);
      console.log('Secret token (first 10 chars):', secretToken.substring(0, 10) + '...');
      
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const encryptedToken = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        console.log('Generated encrypted token:', encryptedToken);
        console.log('Encrypted token length:', encryptedToken.length);
        
        const response = {
          plainToken: plainToken,
          encryptedToken: encryptedToken
        };
        
        console.log('=== Sending validation response ===');
        console.log('Response:', JSON.stringify(response, null, 2));
        
        return new Response(
          JSON.stringify(response),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      } catch (cryptoError) {
        console.error('Error generating encrypted token:', cryptoError);
        return new Response(JSON.stringify({ 
          error: 'Failed to generate encrypted token' 
        }), { 
          status: 500, 
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders 
          }
        });
      }
    }

    // For actual webhook events (non-validation), verify authentication
    const secretToken = Deno.env.get('ZOOM_WEBHOOK_SECRET_TOKEN');
    if (secretToken) {
      console.log('Verifying webhook authenticity for event:', payload.event);
      
      // Check for Authorization header (custom authentication header method)
      const authHeader = req.headers.get('authorization');
      if (authHeader) {
        console.log('Authorization header found:', authHeader.substring(0, 20) + '...');
        
        if (authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          if (token !== secretToken) {
            console.error('Invalid webhook secret token in Authorization header');
            return new Response('Unauthorized', { status: 401, headers: corsHeaders });
          }
          console.log('Authorization header validation successful');
        } else {
          console.error('Authorization header format invalid - should start with "Bearer "');
          return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        }
      } else {
        console.log('No Authorization header found - webhook might be using different auth method');
        // For now, we'll allow it through but log it for monitoring
        console.log('Proceeding without header authentication - monitor for security');
      }
    }

    // Only process recording.completed events
    if (payload.event !== 'recording.completed') {
      console.log('Ignoring non-recording event:', payload.event);
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Event ignored - not a recording completion' 
      }), { 
        status: 200, 
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders 
        }
      });
    }

    console.log('=== Processing recording.completed event ===');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const webhookPayload = payload as ZoomWebhookPayload;
    const meetingData = webhookPayload.payload.object;
    
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
    console.error('=== Error in zoom-webhook function ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
