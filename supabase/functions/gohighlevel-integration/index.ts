
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GoHighLevelRequest {
  action: 'createContact' | 'createAppointment' | 'getCalendars';
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  contactId?: string;
  calendarId?: string;
  startTime?: string;
  title?: string;
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GOHIGHLEVEL_API_KEY");
    if (!apiKey) {
      throw new Error("GoHighLevel API key not configured");
    }

    const requestData: GoHighLevelRequest = await req.json();
    console.log('GoHighLevel request:', requestData.action);

    const baseUrl = "https://rest.gohighlevel.com/v1";
    const headers = {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };

    let response;

    switch (requestData.action) {
      case 'createContact': {
        const contactData = {
          firstName: requestData.firstName,
          lastName: requestData.lastName,
          email: requestData.email,
          phone: requestData.phone,
        };

        const contactResponse = await fetch(`${baseUrl}/contacts/`, {
          method: "POST",
          headers,
          body: JSON.stringify(contactData),
        });

        if (!contactResponse.ok) {
          throw new Error(`GoHighLevel API error: ${contactResponse.statusText}`);
        }

        const contactResult = await contactResponse.json();
        console.log('Contact created:', contactResult.contact?.id);

        response = {
          contactId: contactResult.contact?.id,
          success: true
        };
        break;
      }

      case 'createAppointment': {
        const appointmentData = {
          calendarId: requestData.calendarId,
          contactId: requestData.contactId,
          startTime: requestData.startTime,
          title: requestData.title || "Interview",
          notes: requestData.notes || "",
        };

        const appointmentResponse = await fetch(`${baseUrl}/appointments/`, {
          method: "POST",
          headers,
          body: JSON.stringify(appointmentData),
        });

        if (!appointmentResponse.ok) {
          throw new Error(`GoHighLevel API error: ${appointmentResponse.statusText}`);
        }

        const appointmentResult = await appointmentResponse.json();
        console.log('Appointment created:', appointmentResult.appointment?.id);

        response = {
          appointmentId: appointmentResult.appointment?.id,
          success: true
        };
        break;
      }

      case 'getCalendars': {
        const calendarsResponse = await fetch(`${baseUrl}/calendars/`, {
          method: "GET",
          headers,
        });

        if (!calendarsResponse.ok) {
          throw new Error(`GoHighLevel API error: ${calendarsResponse.statusText}`);
        }

        const calendarsResult = await calendarsResponse.json();
        console.log('Calendars retrieved:', calendarsResult.calendars?.length);

        response = {
          calendars: calendarsResult.calendars,
          success: true
        };
        break;
      }

      default:
        throw new Error(`Unknown action: ${requestData.action}`);
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in GoHighLevel integration:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
