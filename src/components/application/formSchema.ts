import { z } from 'zod';

export const applicationFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  location: z.string().min(1, 'Location is required'),
  weekendAvailability: z.enum(['yes', 'no'], {
    required_error: 'Please select your weekend availability'
  }),
  
  // Voice recordings
  introductionRecording: z.string().optional(),
  scriptRecording: z.string().optional(),
  
  // File uploads
  downloadSpeedScreenshot: z.string().optional(),
  uploadSpeedScreenshot: z.string().optional(),
  workstationPhoto: z.string().optional(),
  
  // Listening test
  husbandName: z.string().min(1, 'This field is required'),
  treatmentNotDone: z.string().min(1, 'This field is required'),
  
  // Pre-screening questions
  motivationResponse: z.string().min(50, 'Please provide at least 50 characters explaining your motivation'),
  experienceResponse: z.string().min(30, 'Please provide at least 30 characters about your experience'),
  availabilityResponse: z.string().min(1, 'Please select your availability'),
  
  // Terms
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
