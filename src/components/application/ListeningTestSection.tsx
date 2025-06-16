
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ApplicationFormData } from './formSchema';

interface ListeningTestSectionProps {
  form: UseFormReturn<ApplicationFormData>;
}

export const ListeningTestSection = ({ form }: ListeningTestSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Listening Comprehension Test</h3>
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="font-medium mb-2">
          Listen to this Recording{' '}
          <a 
            href="https://voca.ro/1714xBYyDAkt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            https://voca.ro/1714xBYyDAkt
          </a>
          {' '}and answer the next two questions off of it.
        </p>
      </div>
      
      <div>
        <Label>What Was Her Husband's Name</Label>
        <RadioGroup 
          value={form.watch('husbandName')} 
          onValueChange={(value) => form.setValue('husbandName', value as 'Mark' | 'Steve' | 'Joesph' | 'Bob')}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Mark" id="mark" />
            <Label htmlFor="mark">Mark</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Steve" id="steve" />
            <Label htmlFor="steve">Steve</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Joesph" id="joesph" />
            <Label htmlFor="joesph">Joesph</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Bob" id="bob" />
            <Label htmlFor="bob">Bob</Label>
          </div>
        </RadioGroup>
        {form.formState.errors.husbandName && (
          <p className="text-sm text-red-600">{form.formState.errors.husbandName.message}</p>
        )}
      </div>
      
      <div>
        <Label>What Treatments Has Sharon NOT Done Yet?</Label>
        <RadioGroup 
          value={form.watch('treatmentNotDone')} 
          onValueChange={(value) => form.setValue('treatmentNotDone', value as 'Shots' | 'Knee Replacement Surgery' | 'Physical Therapy')}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Shots" id="shots" />
            <Label htmlFor="shots">Shots</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Knee Replacement Surgery" id="surgery" />
            <Label htmlFor="surgery">Knee Replacement Surgery</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Physical Therapy" id="therapy" />
            <Label htmlFor="therapy">Physical Therapy</Label>
          </div>
        </RadioGroup>
        {form.formState.errors.treatmentNotDone && (
          <p className="text-sm text-red-600">{form.formState.errors.treatmentNotDone.message}</p>
        )}
      </div>
    </div>
  );
};
