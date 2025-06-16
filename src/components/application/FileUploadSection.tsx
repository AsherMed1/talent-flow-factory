
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ApplicationFormData } from './formSchema';

interface FileUploadSectionProps {
  form: UseFormReturn<ApplicationFormData>;
}

export const FileUploadSection = ({ form }: FileUploadSectionProps) => {
  const { toast } = useToast();

  const handleFileUpload = (file: File, fieldName: string) => {
    form.setValue(fieldName as keyof ApplicationFormData, file);
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Required Uploads</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium">
            Upload a Screen Shot of Your Download Internet Speed From https://www.speedtest.net/
          </Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'downloadSpeedScreenshot');
              }}
              className="mt-2 text-sm"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium">
            Upload a Screen Shot of Your Upload Internet Speed From https://www.speedtest.net/
          </Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'uploadSpeedScreenshot');
              }}
              className="mt-2 text-sm"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium">
            Please Upload a Picture of Your Work Station or Computer Setup
          </Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'workstationPhoto');
              }}
              className="mt-2 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
