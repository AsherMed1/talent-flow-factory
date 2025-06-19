
import { z } from 'zod';

// Enhanced URL validation helper
const urlSchema = z.string().url('Please enter a valid URL').refine((url) => {
  try {
    const urlObj = new URL(url);
    // Check for common portfolio platforms and general web URLs
    const portfolioPatterns = [
      /^https?:\/\/(www\.)?(vimeo\.com|player\.vimeo\.com)/,
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)/,
      /^https?:\/\/(www\.)?(behance\.net)/,
      /^https?:\/\/(www\.)?(dribbble\.com)/,
      /^https?:\/\/(www\.)?(github\.io)/,
      /^https?:\/\/(www\.)?(portfolio\.)/,
      /^https?:\/\/.*\.(com|net|org|io|co|dev|me|design|creative|art|studio)$/
    ];
    
    // Allow any HTTPS URL with proper domain structure
    const isValidDomain = urlObj.protocol === 'https:' && urlObj.hostname.includes('.');
    const isPortfolioSite = portfolioPatterns.some(pattern => pattern.test(url));
    
    return isValidDomain || isPortfolioSite;
  } catch {
    return false;
  }
}, {
  message: 'Please provide a valid portfolio URL (must be HTTPS and include a proper domain)'
});

// Video file validation helper
const videoFileSchema = z.string().refine((fileUrl) => {
  if (!fileUrl) return true; // Optional field
  
  // Basic URL validation for uploaded files
  try {
    new URL(fileUrl);
    return true;
  } catch {
    return false;
  }
}, {
  message: 'Invalid video file URL'
});

export const applicationFormSchema = z.object({
  // Basic info with enhanced validation
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long'),
  
  location: z.string()
    .min(2, 'Location must be at least 2 characters')
    .max(100, 'Location must be less than 100 characters'),
  
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
  
  // Unified pre-screening questions with consistent naming
  motivationResponse: z.string()
    .min(50, 'Please provide at least 50 characters explaining your motivation')
    .max(1500, 'Response must be less than 1500 characters'),
  
  experienceResponse: z.string()
    .min(30, 'Please provide at least 30 characters about your experience')
    .max(1500, 'Response must be less than 1500 characters'),
  
  availabilityResponse: z.string()
    .min(1, 'Please select your availability')
    .max(500, 'Response must be less than 500 characters'),
  
  // Additional video editor pre-screening question
  collaborationResponse: z.string().optional(),
  
  // Video Editor specific fields with enhanced validation
  portfolioUrl: z.string().optional(),
  videoUpload: videoFileSchema.optional(),
  
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
  const hasVideoEditorFields = data.portfolioUrl || data.videoEditingExperience || data.softwareSkills || data.recentProjects || data.videoUpload;
  
  if (hasVideoEditorFields) {
    // At least one portfolio method is required (URL or video upload)
    if ((!data.portfolioUrl || data.portfolioUrl.trim().length === 0) && 
        (!data.videoUpload || data.videoUpload.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide either a portfolio URL or upload a demo reel",
        path: ["portfolioUrl"]
      });
    }
    
    // Enhanced portfolio URL validation (only if provided)
    if (data.portfolioUrl && data.portfolioUrl.trim().length > 0) {
      const urlValidation = urlSchema.safeParse(data.portfolioUrl);
      if (!urlValidation.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: urlValidation.error.issues[0].message,
          path: ["portfolioUrl"]
        });
      }
    }
    
    // Enhanced video editing experience validation
    if (!data.videoEditingExperience || data.videoEditingExperience.trim().length < 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least 100 characters describing your video editing experience",
        path: ["videoEditingExperience"]
      });
    } else if (data.videoEditingExperience.trim().length > 2000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Video editing experience description must be less than 2000 characters",
        path: ["videoEditingExperience"]
      });
    }
    
    // Enhanced software skills validation
    if (!data.softwareSkills || data.softwareSkills.trim().length < 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least 50 characters describing your software skills",
        path: ["softwareSkills"]
      });
    } else if (data.softwareSkills.trim().length > 1500) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Software skills description must be less than 1500 characters",
        path: ["softwareSkills"]
      });
    }
    
    // Enhanced recent projects validation
    if (!data.recentProjects || data.recentProjects.trim().length < 150) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide at least 150 characters describing your recent projects",
        path: ["recentProjects"]
      });
    } else if (data.recentProjects.trim().length > 3000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recent projects description must be less than 3000 characters",
        path: ["recentProjects"]
      });
    }

    // Enhanced video editor specific collaboration validation (now optional)
    if (data.collaborationResponse && data.collaborationResponse.trim().length > 0 && data.collaborationResponse.trim().length < 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "If providing collaboration experience, please provide at least 30 characters",
        path: ["collaborationResponse"]
      });
    } else if (data.collaborationResponse && data.collaborationResponse.trim().length > 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Collaboration response must be less than 1000 characters",
        path: ["collaborationResponse"]
      });
    }

    // AI tools experience validation (optional but if provided, should be meaningful)
    if (data.aiToolsExperience && data.aiToolsExperience.trim().length > 0 && data.aiToolsExperience.trim().length < 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "If providing AI tools experience, please provide at least 20 characters",
        path: ["aiToolsExperience"]
      });
    } else if (data.aiToolsExperience && data.aiToolsExperience.trim().length > 1000) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "AI tools experience must be less than 1000 characters",
        path: ["aiToolsExperience"]
      });
    }

    // Creative process validation (optional but if provided, should be meaningful)
    if (data.creativeProcess && data.creativeProcess.trim().length > 0 && data.creativeProcess.trim().length < 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "If describing your creative process, please provide at least 30 characters",
        path: ["creativeProcess"]
      });
    } else if (data.creativeProcess && data.creativeProcess.trim().length > 1200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Creative process description must be less than 1200 characters",
        path: ["creativeProcess"]
      });
    }
  }
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;
