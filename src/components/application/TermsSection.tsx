
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ApplicationFormData } from './formSchema';

interface TermsSectionProps {
  form: UseFormReturn<ApplicationFormData>;
}

export const TermsSection = ({ form }: TermsSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <Checkbox
          id="agreeToTerms"
          checked={form.watch('agreeToTerms')}
          onCheckedChange={(checked) => form.setValue('agreeToTerms', checked as boolean)}
          className="mt-0.5"
        />
        <Label htmlFor="agreeToTerms" className="text-sm text-gray-800 leading-relaxed cursor-pointer">
          I agree to the terms and conditions and authorize the use of my information for employment purposes. 
          <span className="text-red-500 ml-1">*</span>
        </Label>
      </div>
      {form.formState.errors.agreeToTerms && (
        <p className="text-sm text-red-600">{form.formState.errors.agreeToTerms.message}</p>
      )}
    </div>
  );
};
