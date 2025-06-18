
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle } from 'lucide-react';
import { ApplicationFormData } from './formSchema';

interface PreScreeningSectionProps {
  form: UseFormReturn<ApplicationFormData>;
  roleName?: string;
}

export const PreScreeningSection = ({ form, roleName }: PreScreeningSectionProps) => {
  // Determine role type for customized questions
  const isVideoEditor = roleName?.toLowerCase().includes('video editor') || 
                        roleName?.toLowerCase().includes('ai video');
  const isAppointmentSetter = roleName?.toLowerCase().includes('appointment') || 
                              roleName?.toLowerCase().includes('setter') ||
                              !roleName; // Default

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
                  ? "Why do you want this AI video editor role? What motivates you to work in creative video production?"
                  : "Why do you want this appointment setter role? What motivates you to work in sales/customer outreach?"
                }
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={isVideoEditor 
                    ? "Tell us about your passion for video editing, creativity, and what excites you about working with AI tools..."
                    : "Tell us about your motivation, drive, and what excites you about this opportunity..."
                  }
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
          name="experienceResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <span className="text-blue-600">💼</span>
                {isVideoEditor
                  ? "Describe your relevant experience in video editing, creative projects, or content creation"
                  : "Describe your relevant experience in customer service, sales, or phone-based roles"
                }
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={isVideoEditor
                    ? "Share your experience with video projects, creative work, client collaboration, or any relevant background..."
                    : "Share your experience with customer interactions, sales, phone work, or any relevant background..."
                  }
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
          name="availabilityResponse"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <span className="text-green-600">⏰</span>
                What is your availability? Can you work flexible hours, evenings, or weekends if needed?
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
                  <SelectItem value="weekdays-only">Weekdays only (9-5)</SelectItem>
                  <SelectItem value="evenings-weekends">Evenings and weekends preferred</SelectItem>
                  <SelectItem value="specific-hours">Specific hours (will discuss)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
