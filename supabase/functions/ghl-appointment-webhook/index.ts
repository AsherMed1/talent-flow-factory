
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GHLAppointmentData {
  contact?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
  appointment?: {
    startTime?: string;
    endTime?: string;
    calendarId?: string;
    status?: string;
  };
  eventType?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: GHLAppointmentData = await req.json();
    console.log('GHL webhook received:', payload);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract contact email from the payload
    const contactEmail = payload.contact?.email;
    
    if (!contactEmail) {
      console.log('No contact email found in webhook payload');
      return new Response(
        JSON.stringify({ success: false, message: 'No contact email provided' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Find the candidate by email
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', contactEmail)
      .single();

    if (candidateError || !candidate) {
      console.log('Candidate not found for email:', contactEmail);
      return new Response(
        JSON.stringify({ success: false, message: 'Candidate not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Find the most recent application for this candidate
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .select('id, status')
      .eq('candidate_id', candidate.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (applicationError || !application) {
      console.log('Application not found for candidate:', candidate.id);
      return new Response(
        JSON.stringify({ success: false, message: 'Application not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Update application status to interview_scheduled
    const interviewDate = payload.appointment?.startTime ? new Date(payload.appointment.startTime).toISOString() : new Date().toISOString();
    
    const { error: updateError } = await supabase
      .from('applications')
      .update({ 
        status: 'interview_scheduled',
        interview_date: interviewDate,
        updated_at: new Date().toISOString()
      })
      .eq('id', application.id);

    if (updateError) {
      console.error('Error updating application:', updateError);
      throw updateError;
    }

    console.log(`Application ${application.id} updated to interview_scheduled`);

    // Trigger any existing webhooks for status change
    try {
      await supabase.functions.invoke('trigger-webhook', {
        body: {
          eventType: 'interview_scheduled',
          data: {
            application: {
              id: application.id,
              previousStatus: application.status,
              newStatus: 'interview_scheduled',
            },
            candidate: {
              email: contactEmail,
            },
            appointment: payload.appointment,
            timestamp: new Date().toISOString(),
          }
        }
      });
    } catch (webhookError) {
      console.error('Error triggering internal webhooks:', webhookError);
      // Don't fail the whole request if webhook fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Application status updated to interview_scheduled',
        applicationId: application.id
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
    console.error('Error in GHL appointment webhook:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
