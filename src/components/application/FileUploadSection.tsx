
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
      const dataUrl = await convertFileToDataUrl(file);
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
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Required Uploads</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-800 leading-tight block">
            Upload a Screen Shot of Your Download Internet Speed From https://www.speedtest.net/
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'downloadSpeedScreenshot');
              }}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {form.watch('downloadSpeedScreenshot') && (
              <div className="mt-3 text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                <span className="text-green-500">✓</span>
                File uploaded
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-800 leading-tight block">
            Upload a Screen Shot of Your Upload Internet Speed From https://www.speedtest.net/
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'uploadSpeedScreenshot');
              }}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {form.watch('uploadSpeedScreenshot') && (
              <div className="mt-3 text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                <span className="text-green-500">✓</span>
                File uploaded
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-800 leading-tight block">
            Please Upload a Picture of Your Work Station or Computer Setup
          </Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-3" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, 'workstationPhoto');
              }}
              className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {form.watch('workstationPhoto') && (
              <div className="mt-3 text-sm text-green-600 font-medium flex items-center justify-center gap-2">
                <span className="text-green-500">✓</span>
                File uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
