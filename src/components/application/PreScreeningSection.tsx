
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle } from 'lucide-react';
import { ApplicationFormData } from './formSchema';
import { detectRoleType } from '@/utils/roleDetection';

interface PreScreeningSectionProps {
  form: UseFormReturn<ApplicationFormData>;
  roleName?: string;
}

export const PreScreeningSection = ({ form, roleName }: PreScreeningSectionProps) => {
  // Use centralized role detection
  const { isVideoEditor, isAppointmentSetter } = detectRoleType(roleName);

  console.log('PreScreeningSection - roleName:', roleName);
  console.log('PreScreeningSection - isVideoEditor:', isVideoEditor);
  console.log('PreScreeningSection - isAppointmentSetter:', isAppointmentSetter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Pre-Screening Questions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="motivationResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <span className="text-orange-600">🎯</span>
                {isVideoEditor 
                  ? "What drives your passion for video editing and creative storytelling?"
                  : isAppointmentSetter 
                    ? "Why do you want this appointment setter role? What motivates you to work in sales/customer outreach?"
                    : "Why do you want this role? What motivates you in this field?"
                }
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={isVideoEditor 
                    ? "Share what motivates you in video editing, your creative vision, and what excites you about working with AI tools and innovative video technologies..."
                    : isAppointmentSetter 
                      ? "Tell us about your motivation, drive, and what excites you about this opportunity..."
                      : "Tell us about your motivation and what excites you about this opportunity..."
                  }
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
          name="experienceResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <span className="text-blue-600">💼</span>
                {isVideoEditor
                  ? "Describe your journey in video editing and content creation"
                  : isAppointmentSetter
                    ? "Describe your relevant experience in customer service, sales, or phone-based roles"
                    : "Describe your relevant experience in this field"
                }
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={isVideoEditor
                    ? "Tell us about your background in video editing, key projects you've worked on, industries you've served, and how you've developed your skills over time..."
                    : isAppointmentSetter
                      ? "Share your experience with customer interactions, sales, phone work, or any relevant background..."
                      : "Share your relevant experience and background..."
                  }
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
          name="availabilityResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <span className="text-green-600">⏰</span>
                What is your availability? Can you work flexible hours if needed?
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="full-time-flexible">Full-time with flexible schedule</SelectItem>
                  <SelectItem value="part-time-flexible">Part-time with flexible schedule</SelectItem>
                  {isVideoEditor ? (
                    <>
                      <SelectItem value="project-based">Project-based availability</SelectItem>
                      <SelectItem value="retainer-based">Retainer-based work preferred</SelectItem>
                      <SelectItem value="rush-projects">Available for rush projects</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="weekdays-only">Weekdays only (9-5)</SelectItem>
                      <SelectItem value="evenings-weekends">Evenings and weekends preferred</SelectItem>
                      <SelectItem value="specific-hours">Specific hours (will discuss)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Optional collaboration question for video editors */}
        {isVideoEditor && (
          <FormField
            control={form.control}
            name="collaborationResponse"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <span className="text-purple-600">🤝</span>
                  How do you approach client collaboration and feedback? (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your process for working with clients, handling feedback and revisions, and ensuring client satisfaction..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};
