
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, MessageSquare, Clock, Target } from 'lucide-react';
import { ApplicationFormData } from './formSchema';

interface PreScreeningSectionProps {
  form: UseFormReturn<ApplicationFormData>;
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
        <div className="space-y-2">
          <Label htmlFor="motivationResponse" className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <Target className="w-4 h-4 text-orange-500" />
            Why do you want this appointment setter role? What motivates you to work in sales/customer outreach?
          </Label>
          <Textarea
            id="motivationResponse"
            {...form.register('motivationResponse')}
            placeholder="Tell us about your motivation, drive, and what excites you about this opportunity..."
            className="min-h-[100px]"
          />
          {form.formState.errors.motivationResponse && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.motivationResponse.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceResponse" className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            Describe your relevant experience in customer service, sales, or phone-based roles
          </Label>
          <Textarea
            id="experienceResponse"
            {...form.register('experienceResponse')}
            placeholder="Share your experience with customer interactions, sales, phone work, or any relevant background..."
            className="min-h-[100px]"
          />
          {form.formState.errors.experienceResponse && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.experienceResponse.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="availabilityResponse" className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <Clock className="w-4 h-4 text-green-500" />
            What is your availability? Can you work flexible hours, evenings, or weekends if needed?
          </Label>
          <Select 
            value={form.watch('availabilityResponse')} 
            onValueChange={(value) => form.setValue('availabilityResponse', value)}
          >
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
          {form.formState.errors.availabilityResponse && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.availabilityResponse.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
