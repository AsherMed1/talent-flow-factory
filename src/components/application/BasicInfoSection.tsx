
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-gray-800">First Name</Label>
          <Input
            id="firstName"
            {...form.register('firstName')}
            placeholder="Justin"
            className="h-11"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-gray-800">Last Name</Label>
          <Input
            id="lastName"
            {...form.register('lastName')}
            placeholder="Lesh"
            className="h-11"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-800">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...form.register('email')}
          placeholder="justinlesh1@gmail.com"
          className="h-11"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium text-gray-800">
          Where do you live (City, State, Country)
        </Label>
        <Input
          id="location"
          {...form.register('location')}
          placeholder="e.g., Miami, FL, USA"
          className="h-11"
        />
        {form.formState.errors.location && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.location.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="weekendAvailability" className="text-sm font-medium text-gray-800">
          Are You Available To Work Weekends? (Saturday /Sunday)
        </Label>
        <Textarea
          id="weekendAvailability"
          {...form.register('weekendAvailability')}
          placeholder="Please describe your weekend availability"
          className="min-h-[100px] resize-none"
        />
        {form.formState.errors.weekendAvailability && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.weekendAvailability.message}</p>
        )}
      </div>
    </div>
  );
};
