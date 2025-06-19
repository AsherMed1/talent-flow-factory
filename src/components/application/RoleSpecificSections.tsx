import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Code, Palette } from 'lucide-react';
import { ApplicationFormData } from './formSchema';
import { VideoUploadSection } from './VideoUploadSection';
import { detectRoleType } from '@/utils/roleDetection';

interface RoleSpecificSectionsProps {
  form: UseFormReturn<ApplicationFormData>;
  roleName?: string;
}

export const RoleSpecificSections = ({ form, roleName }: RoleSpecificSectionsProps) => {
  if (!roleName) return null;

  // Use centralized role detection
  const { isVideoEditor } = detectRoleType(roleName);

  console.log('RoleSpecificSections - roleName:', roleName);
  console.log('RoleSpecificSections - isVideoEditor:', isVideoEditor);

  // AI Video Editor specific sections
  if (isVideoEditor) {
    return (
      <>
        {/* Portfolio & Video Upload Section */}
        <VideoUploadSection form={form} />

        {/* Experience Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Experience & Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="videoEditingExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Editing Experience *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your video editing experience in detail, including software you've used (e.g., Premiere Pro, After Effects, DaVinci Resolve), types of projects you've worked on, and any AI video tools you're familiar with..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide at least 100 characters describing your experience
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aiToolsExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Video Tools Experience</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your experience with AI video editing tools (e.g., Runway ML, Pika Labs, Stable Video Diffusion, etc.). If you haven't used AI tools yet, describe your interest in learning them..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Technical Skills Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Technical Skills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="softwareSkills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Editing Software Proficiency *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List the video editing software you're proficient in and rate your skill level (e.g., Adobe Premiere Pro - Expert, After Effects - Intermediate, DaVinci Resolve - Beginner)..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide at least 50 characters describing your software skills
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="creativeProcess"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Creative Process & Style</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your creative process and editing style. What makes your video editing unique? How do you approach storytelling through video?"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Project Examples Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="recentProjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe Your 3 Most Recent Video Projects *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="For each project, describe: 1) The type of video (commercial, social media, educational, etc.), 2) Your role and responsibilities, 3) Tools/software used, 4) Duration of the project, 5) Key challenges and how you solved them. Include links if available..."
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide at least 150 characters with detailed project descriptions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </>
    );
  }

  // For appointment setter and other roles, return null (they use the default sections)
  return null;
};
