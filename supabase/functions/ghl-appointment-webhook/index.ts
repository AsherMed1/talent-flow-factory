
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
    console.log('GHL webhook received:', JSON.stringify(payload, null, 2));

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

    console.log('Looking for candidate with email:', contactEmail);

    // Find the candidate by email
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, name, email')
      .eq('email', contactEmail)
      .single();

    if (candidateError || !candidate) {
      console.log('Candidate not found for email:', contactEmail, candidateError);
      return new Response(
        JSON.stringify({ success: false, message: 'Candidate not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Found candidate:', candidate);

    // Find the most recent application for this candidate
    const { data: application, error: applicationError } = await supabase
      .from('applications')
      .select('id, status, candidate_id')
      .eq('candidate_id', candidate.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (applicationError || !application) {
      console.log('Application not found for candidate:', candidate.id, applicationError);
      return new Response(
        JSON.stringify({ success: false, message: 'Application not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Found application:', application);

    // Update application status to interview_scheduled
    const interviewDate = payload.appointment?.startTime ? new Date(payload.appointment.startTime).toISOString() : new Date().toISOString();
    
    console.log('Updating application status to interview_scheduled with interview date:', interviewDate);

    const { data: updatedApplication, error: updateError } = await supabase
      .from('applications')
      .update({ 
        status: 'interview_scheduled',
        interview_date: interviewDate,
        updated_at: new Date().toISOString(),
        ghl_appointment_data: payload
      })
      .eq('id', application.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating application:', updateError);
      throw updateError;
    }

    console.log('Application updated successfully:', updatedApplication);

    // Trigger any existing webhooks for status change
    try {
      console.log('Triggering internal webhooks for status change...');
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
              id: candidate.id,
              name: candidate.name,
              email: contactEmail,
            },
            appointment: payload.appointment,
            timestamp: new Date().toISOString(),
          }
        }
      });
      console.log('Internal webhooks triggered successfully');
    } catch (webhookError) {
      console.error('Error triggering internal webhooks:', webhookError);
      // Don't fail the whole request if webhook fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Application status updated to interview_scheduled',
        applicationId: application.id,
        candidateName: candidate.name,
        candidateEmail: contactEmail,
        interviewDate: interviewDate
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
