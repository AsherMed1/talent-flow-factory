
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

  const convertFileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File, fieldName: string) => {
    try {
      // Convert file to data URL for storage
      const dataUrl = await convertFileToDataUrl(file);
      
      // Set the data URL in the form
      form.setValue(fieldName as keyof ApplicationFormData, dataUrl);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error('Error converting file:', error);
      toast({
        title: "Upload Error",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      });
    }
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
            {form.watch('downloadSpeedScreenshot') && (
              <div className="mt-2 text-xs text-green-600">✓ File uploaded</div>
            )}
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
            {form.watch('uploadSpeedScreenshot') && (
              <div className="mt-2 text-xs text-green-600">✓ File uploaded</div>
            )}
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
            {form.watch('workstationPhoto') && (
              <div className="mt-2 text-xs text-green-600">✓ File uploaded</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
