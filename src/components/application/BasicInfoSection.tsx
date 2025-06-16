
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ApplicationFormData } from './formSchema';

interface BasicInfoSectionProps {
  form: UseFormReturn<ApplicationFormData>;
}

export const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...form.register('firstName')}
            placeholder="Justin"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...form.register('lastName')}
            placeholder="Lesh"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...form.register('email')}
          placeholder="justinlesh1@gmail.com"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="location">Where do you live (City, State, Country)</Label>
        <Input
          id="location"
          {...form.register('location')}
          placeholder="e.g., Miami, FL, USA"
        />
        {form.formState.errors.location && (
          <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="weekendAvailability">Are You Available To Work Weekends? (Saturday /Sunday)</Label>
        <Textarea
          id="weekendAvailability"
          {...form.register('weekendAvailability')}
          placeholder="Please describe your weekend availability"
          className="mt-2"
        />
        {form.formState.errors.weekendAvailability && (
          <p className="text-sm text-red-600">{form.formState.errors.weekendAvailability.message}</p>
        )}
      </div>
    </div>
  );
};
