
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ApplicationFormData } from './formSchema';

interface ListeningTestSectionProps {
  form: UseFormReturn<ApplicationFormData>;
}

export const ListeningTestSection = ({ form }: ListeningTestSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Listening Comprehension Test</h3>
      
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <p className="font-medium text-gray-900 mb-4 text-base">
          Listen to this recording and answer the next two questions based on it:
        </p>
        <div className="flex flex-col items-center space-y-3">
          <iframe 
            width="300" 
            height="60" 
            src="https://vocaroo.com/embed/1714xBYyDAkt?autoplay=0" 
            frameBorder="0" 
            allow="autoplay"
            className="rounded border border-gray-300"
          />
          <a 
            href="https://voca.ro/1714xBYyDAkt" 
            title="Vocaroo Voice Recorder" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
          >
            View on Vocaroo &gt;&gt;
          </a>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label className="text-base font-medium text-gray-800 block">What Was Her Husband's Name</Label>
        <RadioGroup 
          value={form.watch('husbandName')} 
          onValueChange={(value) => form.setValue('husbandName', value as 'Mark' | 'Steve' | 'Joesph' | 'Bob')}
          className="grid grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="Mark" id="mark" />
            <Label htmlFor="mark" className="text-sm font-medium cursor-pointer">Mark</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="Steve" id="steve" />
            <Label htmlFor="steve" className="text-sm font-medium cursor-pointer">Steve</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="Joesph" id="joesph" />
            <Label htmlFor="joesph" className="text-sm font-medium cursor-pointer">Joesph</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="Bob" id="bob" />
            <Label htmlFor="bob" className="text-sm font-medium cursor-pointer">Bob</Label>
          </div>
        </RadioGroup>
        {form.formState.errors.husbandName && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.husbandName.message}</p>
        )}
      </div>
      
      <div className="space-y-4">
        <Label className="text-base font-medium text-gray-800 block">What Treatments Has Sharon NOT Done Yet?</Label>
        <RadioGroup 
          value={form.watch('treatmentNotDone')} 
          onValueChange={(value) => form.setValue('treatmentNotDone', value as 'Shots' | 'Knee Replacement Surgery' | 'Physical Therapy')}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="Shots" id="shots" />
            <Label htmlFor="shots" className="text-sm font-medium cursor-pointer">Shots</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="Knee Replacement Surgery" id="surgery" />
            <Label htmlFor="surgery" className="text-sm font-medium cursor-pointer">Knee Replacement Surgery</Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="Physical Therapy" id="therapy" />
            <Label htmlFor="therapy" className="text-sm font-medium cursor-pointer">Physical Therapy</Label>
          </div>
        </RadioGroup>
        {form.formState.errors.treatmentNotDone && (
          <p className="text-sm text-red-600 mt-1">{form.formState.errors.treatmentNotDone.message}</p>
        )}
      </div>
    </div>
  );
};
