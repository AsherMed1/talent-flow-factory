
import * as z from 'zod';

export const applicationSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  location: z.string().min(1, 'Location is required'),
  
  // Availability
  weekendAvailability: z.string().min(1, 'Weekend availability is required'),
  
  // Voice Recordings
  introductionRecording: z.string().optional(),
  scriptRecording: z.string().optional(),
  
  // File Uploads
  downloadSpeedScreenshot: z.any().optional(),
  uploadSpeedScreenshot: z.any().optional(),
  workstationPhoto: z.any().optional(),
  
  // Listening Comprehension
  husbandName: z.enum(['Mark', 'Steve', 'Joesph', 'Bob'], {
    required_error: 'Please select an answer',
  }),
  treatmentNotDone: z.enum(['Shots', 'Knee Replacement Surgery', 'Physical Therapy'], {
    required_error: 'Please select an answer',
  }),
  
  // Agreement
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
