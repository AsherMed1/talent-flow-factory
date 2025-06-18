
import { z } from 'zod';

export const applicationFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  location: z.string().min(1, 'Location is required'),
  weekendAvailability: z.enum(['yes', 'no', 'on-occasion'], {
    required_error: 'Please select your weekend availability'
  }),
  
  // Voice recordings (mainly for appointment setter)
  introductionRecording: z.string().optional(),
  scriptRecording: z.string().optional(),
  
  // File uploads (mainly for appointment setter)
  downloadSpeedScreenshot: z.string().optional(),
  uploadSpeedScreenshot: z.string().optional(),
  workstationPhoto: z.string().optional(),
  
  // Listening test (mainly for appointment setter)
  husbandName: z.string().optional(),
  treatmentNotDone: z.string().optional(),
  
  // Pre-screening questions (generic)
  motivationResponse: z.string().min(50, 'Please provide at least 50 characters explaining your motivation'),
  experienceResponse: z.string().min(30, 'Please provide at least 30 characters about your experience'),
  availabilityResponse: z.string().min(1, 'Please select your availability'),
  
  // Video Editor specific fields
  portfolioUrl: z.string().optional(),
  videoEditingExperience: z.string().optional(),
  aiToolsExperience: z.string().optional(),
  softwareSkills: z.string().optional(),
  creativeProcess: z.string().optional(),
  recentProjects: z.string().optional(),
  
  // Terms
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions'
  })
}).refine((data) => {
  // Custom validation: if certain fields are present, make some video editor fields required
  const isVideoEditor = data.portfolioUrl !== undefined || data.videoEditingExperience !== undefined;
  
  if (isVideoEditor) {
    return data.portfolioUrl && data.portfolioUrl.length > 0 && 
           data.videoEditingExperience && data.videoEditingExperience.length >= 50 &&
           data.softwareSkills && data.softwareSkills.length > 0 &&
           data.recentProjects && data.recentProjects.length >= 100;
  }
  
  return true;
}, {
  message: "Please complete all required video editor fields",
  path: ["portfolioUrl"]
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
