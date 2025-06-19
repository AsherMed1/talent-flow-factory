
import { supabase } from '@/integrations/supabase/client';

interface GHLWebhookData {
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  calendar: {
    startTime: string;
    endTime: string;
    appointmentId: string;
    status: string;
    appoinmentStatus: string;
    address: string;
    calendarName: string;
  };
}

export const processFailedWebhookData = async () => {
  // Webhook data from the logs
  const cathWebhookData: GHLWebhookData = {
    email: "cath.p@patientpromarketing.com",
    first_name: "cath",
    last_name: "portez", 
    full_name: "cath portez",
    calendar: {
      startTime: "2025-06-26T10:00:00",
      endTime: "2025-06-26T10:30:00",
      appointmentId: "ii4IAoCjB8gTr5m8Qdo3",
      status: "booked",
      appoinmentStatus: "confirmed",
      address: "https://us06web.zoom.us/j/84818308938?pwd=Fge1J6hY122j1IqfylsWbFvlsKSihg.1",
      calendarName: "Scheduler Interview (Please Only Schedule If You Are Available To Work Weekends)"
    }
  };

  const esteeWebhookData: GHLWebhookData = {
    email: "estee.c@patientpromarketing.com",
    first_name: "Estee",
    last_name: "Claasen",
    full_name: "Estee Claasen", 
    calendar: {
      startTime: "2025-06-23T14:30:00",
      endTime: "2025-06-23T15:00:00",
      appointmentId: "EzKTPYMMk8Htf6VKrkio",
      status: "booked",
      appoinmentStatus: "confirmed",
      address: "https://us06web.zoom.us/j/84818308938?pwd=Fge1J6hY122j1IqfylsWbFvlsKSihg.1",
      calendarName: "Scheduler Interview (Please Only Schedule If You Are Available To Work Weekends)"
    }
  };

  const results = [];

  // Process each candidate
  for (const webhookData of [cathWebhookData, esteeWebhookData]) {
    console.log(`Processing ${webhookData.full_name} (${webhookData.email})`);
    
    try {
      // Find candidates with this email
      const { data: candidates, error: candidateError } = await supabase
        .from('candidates')
        .select('id, name, email, created_at')
        .eq('email', webhookData.email)
        .order('created_at', { ascending: false }); // Get most recent first

      if (candidateError) {
        console.error(`Error finding candidates for ${webhookData.email}:`, candidateError);
        results.push({ email: webhookData.email, success: false, error: candidateError.message });
        continue;
      }

      if (!candidates || candidates.length === 0) {
        console.log(`No candidates found for ${webhookData.email}`);
        results.push({ email: webhookData.email, success: false, error: 'No candidates found' });
        continue;
      }

      // Use the most recent candidate (first in the ordered list)
      const candidate = candidates[0];
      console.log(`Using candidate: ${candidate.name} (ID: ${candidate.id})`);

      // Find their most recent application
      const { data: applications, error: applicationError } = await supabase
        .from('applications')
        .select('id, status, candidate_id')
        .eq('candidate_id', candidate.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (applicationError) {
        console.error(`Error finding application for ${candidate.name}:`, applicationError);
        results.push({ email: webhookData.email, success: false, error: applicationError.message });
        continue;
      }

      if (!applications || applications.length === 0) {
        console.log(`No applications found for ${candidate.name}`);
        results.push({ email: webhookData.email, success: false, error: 'No applications found' });
        continue;
      }

      const application = applications[0];
      console.log(`Found application: ${application.id} with status: ${application.status}`);

      // Update application to interview_scheduled with webhook data
      const interviewDate = new Date(webhookData.calendar.startTime).toISOString();
      
      const { data: updatedApplication, error: updateError } = await supabase
        .from('applications')
        .update({
          status: 'interview_scheduled',
          interview_date: interviewDate,
          updated_at: new Date().toISOString(),
          ghl_appointment_data: JSON.parse(JSON.stringify(webhookData))
        })
        .eq('id', application.id)
        .select()
        .single();

      if (updateError) {
        console.error(`Error updating application for ${candidate.name}:`, updateError);
        results.push({ email: webhookData.email, success: false, error: updateError.message });
        continue;
      }

      console.log(`Successfully updated ${candidate.name} to interview_scheduled`);
      results.push({ 
        email: webhookData.email, 
        success: true, 
        candidateName: candidate.name,
        applicationId: application.id,
        interviewDate: interviewDate
      });

      // Trigger webhook for status change
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
                id: candidate.id,
                name: candidate.name,
                email: webhookData.email,
              },
              appointment: webhookData.calendar,
              timestamp: new Date().toISOString(),
            }
          }
        });
        console.log(`Webhook triggered for ${candidate.name}`);
      } catch (webhookError) {
        console.error(`Error triggering webhook for ${candidate.name}:`, webhookError);
      }

    } catch (error) {
      console.error(`Unexpected error processing ${webhookData.email}:`, error);
      results.push({ email: webhookData.email, success: false, error: error.message });
    }
  }

  return results;
};
