
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Briefcase, Code, Palette } from 'lucide-react';
import { ApplicationFormData } from './formSchema';

interface RoleSpecificSectionsProps {
  form: UseFormReturn<ApplicationFormData>;
  roleName?: string;
}

export const RoleSpecificSections = ({ form, roleName }: RoleSpecificSectionsProps) => {
  if (!roleName) return null;

  // More flexible matching for video editor roles
  const isVideoEditor = roleName.toLowerCase().includes('video') || 
                        roleName.toLowerCase().includes('editor') ||
                        roleName.toLowerCase().includes('content creator');

  console.log('RoleSpecificSections - roleName:', roleName);
  console.log('RoleSpecificSections - isVideoEditor:', isVideoEditor);

  // AI Video Editor specific sections
  if (isVideoEditor) {
    return (
      <>
        {/* Portfolio Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Portfolio & Experience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portfolio URL *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://your-portfolio.com or https://vimeo.com/your-videos" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="videoEditingExperience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Editing Experience *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your video editing experience, including software you've used (e.g., Premiere Pro, After Effects, DaVinci Resolve), types of projects you've worked on, and any AI video tools you're familiar with..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
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
                      placeholder="For each project, briefly describe: 1) The type of video (commercial, social media, educational, etc.), 2) Your role and responsibilities, 3) Tools/software used, 4) Duration of the project. Include links if available..."
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
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
