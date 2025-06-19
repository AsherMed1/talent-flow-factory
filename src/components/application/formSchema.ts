
import { z } from 'zod';

// URL validation helper
const urlSchema = z.string().url('Please enter a valid URL').refine((url) => {
  // Check for common portfolio platforms
  const portfolioPatterns = [
    /^https?:\/\/(www\.)?(vimeo\.com|player\.vimeo\.com)/,
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/,
    /^https?:\/\/(www\.)?(behance\.net)/,
    /^https?:\/\/(www\.)?(dribbble\.com)/,
    /^https?:\/\/(www\.)?.*\.(com|net|org|io|co)/
  ];
  
  return portfolioPatterns.some(pattern => pattern.test(url));
}, {
  message: 'Please provide a valid portfolio URL (Vimeo, YouTube, Behance, personal website, etc.)'
});

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
}).superRefine((data, ctx) => {
  // Detect if this is a video editor application
  const hasVideoEditorFields = data.portfolioUrl || data.videoEditingExperience || data.softwareSkills || data.recentProjects;
  
  if (hasVideoEditorFields) {
    // Portfolio URL validation
    if (!data.portfolioUrl || data.portfolioUrl.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Portfolio URL is required for video editor positions",
        path: ["portfolioUrl"]
      });
    } else {
      // Validate URL format
      const urlValidation = urlSchema.safeParse(data.portfolioUrl);
      if (!urlValidation.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: urlValidation.error.issues[0].message,
          path: ["portfolioUrl"]
        });
      }
    }
    
    // Video editing experience validation
    if (!data.videoEditingExperience || data.videoEditingExperience.trim().length < 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least 100 characters describing your video editing experience",
        path: ["videoEditingExperience"]
      });
    }
    
    // Software skills validation
    if (!data.softwareSkills || data.softwareSkills.trim().length < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least 50 characters describing your software skills",
        path: ["softwareSkills"]
      });
    }
    
    // Recent projects validation
    if (!data.recentProjects || data.recentProjects.trim().length < 150) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least 150 characters describing your recent projects",
        path: ["recentProjects"]
      });
    }
  }
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
