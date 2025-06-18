
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, MessageSquare, Clock, Target } from 'lucide-react';

interface PreScreeningSectionProps {
  form: UseFormReturn<any>;
}

export const PreScreeningSection = ({ form }: PreScreeningSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
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
                <Target className="w-4 h-4 text-orange-500" />
                Why do you want this appointment setter role? What motivates you to work in sales/customer outreach?
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your motivation, drive, and what excites you about this opportunity..."
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
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Describe your relevant experience in customer service, sales, or phone-based roles
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience with customer interactions, sales, phone work, or any relevant background..."
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
                <Clock className="w-4 h-4 text-green-500" />
                What is your availability? Can you work flexible hours, evenings, or weekends if needed?
              </FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time-flexible">Full-time with flexible hours (evenings/weekends OK)</SelectItem>
                    <SelectItem value="full-time-standard">Full-time standard business hours only</SelectItem>
                    <SelectItem value="part-time-flexible">Part-time with flexible hours (evenings/weekends OK)</SelectItem>
                    <SelectItem value="part-time-standard">Part-time standard business hours only</SelectItem>
                    <SelectItem value="weekends-only">Weekends only</SelectItem>
                    <SelectItem value="evenings-only">Evenings only</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
