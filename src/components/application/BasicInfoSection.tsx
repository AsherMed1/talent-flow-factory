
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocationInput } from '@/components/ui/location-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
        <LocationInput
          id="location"
          {...form.register('location')}
          placeholder="Start typing your city..."
          className="h-11"
          onLocationSelect={(location) => {
            form.setValue('location', location.displayName);
          }}
        />
        <p className="text-xs text-gray-500 mt-1">
          Start typing to see location suggestions from around the world
        </p>
        {form.formState.errors.location && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.location.message}</p>
        )}
      </div>
      
      <div className="space-y-3">
        <Label className="text-sm font-medium text-gray-800">
          Are You Available To Work Weekends? (Saturday /Sunday)
        </Label>
        <RadioGroup
          value={form.watch('weekendAvailability')}
          onValueChange={(value) => form.setValue('weekendAvailability', value as 'yes' | 'no' | 'on-occasion')}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="weekend-yes" />
            <Label htmlFor="weekend-yes" className="text-sm font-normal cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="weekend-no" />
            <Label htmlFor="weekend-no" className="text-sm font-normal cursor-pointer">No</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="on-occasion" id="weekend-occasion" />
            <Label htmlFor="weekend-occasion" className="text-sm font-normal cursor-pointer">On Occasion</Label>
          </div>
        </RadioGroup>
        {form.formState.errors.weekendAvailability && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.weekendAvailability.message}</p>
        )}
      </div>
    </div>
  );
};
