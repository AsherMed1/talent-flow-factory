
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Video, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ApplicationFormData } from './formSchema';
import { uploadVideoFile } from '@/utils/videoStorage';

interface VideoUploadSectionProps {
  form: UseFormReturn<ApplicationFormData>;
}

// Enhanced validation constants
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mov', 
  'video/avi', 
  'video/wmv', 
  'video/webm',
  'video/quicktime'
];

const MAX_FILE_SIZE = 150 * 1024 * 1024; // 150MB in bytes
const MIN_FILE_SIZE = 100 * 1024; // 100KB minimum

const validateVideoFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Please upload: ${ALLOWED_VIDEO_TYPES.map(type => type.split('/')[1].toUpperCase()).join(', ')}`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size is ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`
    };
  }

  if (file.size < MIN_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too small. Minimum size is ${Math.round(MIN_FILE_SIZE / 1024)}KB`
    };
  }

  // Check filename
  if (file.name.length > 255) {
    return {
      isValid: false,
      error: 'Filename is too long. Please rename your file.'
    };
  }

  // Check for potentially problematic characters in filename
  const problematicChars = /[<>:"/\\|?*]/g;
  if (problematicChars.test(file.name)) {
    return {
      isValid: false,
      error: 'Filename contains invalid characters. Please rename your file.'
    };
  }

  return { isValid: true };
};

export const VideoUploadSection = ({ form }: VideoUploadSectionProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingFileName, setUploadingFileName] = useState<string>('');

  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    // Clear previous errors
    setUploadError(null);
    setUploadingFileName(file.name);

    // Enhanced validation
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file');
      toast({
        title: "File Validation Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Enhanced progress simulation with realistic timing
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          // Slower progress as it gets higher (more realistic)
          const increment = prev < 30 ? 12 : prev < 60 ? 8 : prev < 80 ? 4 : 2;
          return Math.min(prev + increment, 90);
        });
      }, 400);

      // Create sanitized filename
      const sanitizedName = file.name.replace(/[<>:"/\\|?*]/g, '_');
      const timestamp = Date.now();
      const fileName = `demo-reel-${timestamp}-${sanitizedName}`;

      const result = await uploadVideoFile(file, fileName);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        form.setValue('videoUpload', result.url);
        toast({
          title: "Upload Complete!",
          description: `"${file.name}" has been uploaded successfully and will be auto-saved.`,
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      setUploadError(errorMessage);
      toast({
        title: "Upload Failed",
        description: `Failed to upload "${file.name}": ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadingFileName('');
      setTimeout(() => {
        setUploadProgress(0);
        setUploadError(null);
      }, 3000);
    }
  };

  const handleRemoveVideo = () => {
    form.setValue('videoUpload', '');
    setUploadError(null);
    toast({
      title: "Video Removed",
      description: "Your uploaded video has been removed and changes will be auto-saved.",
    });
  };

  const portfolioUrl = form.watch('portfolioUrl');
  const videoUpload = form.watch('videoUpload');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5" />
          Portfolio & Demo Reel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="portfolioUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://vimeo.com/your-videos or https://your-portfolio.com" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Link to your online portfolio (Vimeo, YouTube, Behance, or personal website). Must be HTTPS.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              OR
            </span>
          </div>
        </div>

        <FormField
          control={form.control}
          name="videoUpload"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Demo Reel</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {!videoUpload ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Upload your best demo reel or sample video work
                        </p>
                        <p className="text-xs text-gray-500">
                          Supported: MP4, MOV, AVI, WMV, WebM, QuickTime
                        </p>
                        <p className="text-xs text-gray-500">
                          Size: 100KB - 150MB • Auto-saved when uploaded
                        </p>
                      </div>
                      <input
                        type="file"
                        accept={ALLOWED_VIDEO_TYPES.join(',')}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVideoUpload(file);
                        }}
                        disabled={isUploading}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      
                      {isUploading && (
                        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3 mb-3">
                            <Clock className="w-5 h-5 text-blue-600 animate-pulse" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-blue-800">
                                Uploading "{uploadingFileName}"
                              </p>
                              <p className="text-xs text-blue-600">
                                Please don't close this page • Progress will be auto-saved
                              </p>
                            </div>
                          </div>
                          <div className="w-full bg-blue-100 rounded-full h-3">
                            <div 
                              className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-blue-700 mt-2 text-center font-medium">
                            {uploadProgress}% complete
                          </p>
                        </div>
                      )}

                      {uploadError && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700 mb-2">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm font-medium">Upload Failed</p>
                          </div>
                          <p className="text-sm text-red-600">{uploadError}</p>
                          <p className="text-xs text-red-500 mt-1">
                            Please try again or contact support if the issue persists.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Demo reel uploaded successfully</p>
                          <p className="text-xs text-green-600">Auto-saved and ready for review</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveVideo}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                {portfolioUrl 
                  ? "Optional: Upload a video file in addition to your portfolio URL" 
                  : "Required if no portfolio URL is provided"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
