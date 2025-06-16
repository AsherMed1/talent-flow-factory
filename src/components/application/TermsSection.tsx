
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
      <div className="flex items-center space-x-2">
        <Checkbox
          id="agreeToTerms"
          checked={form.watch('agreeToTerms')}
          onCheckedChange={(checked) => form.setValue('agreeToTerms', checked as boolean)}
        />
        <Label htmlFor="agreeToTerms" className="text-sm">
          I agree to the terms and conditions and authorize the use of my information for employment purposes. *
        </Label>
      </div>
      {form.formState.errors.agreeToTerms && (
        <p className="text-sm text-red-600">{form.formState.errors.agreeToTerms.message}</p>
      )}
    </div>
  );
};
