
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, Video, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { ApplicationFormData } from './formSchema';
import { uploadVideoFile } from '@/utils/videoStorage';

interface VideoUploadSectionProps {
  form: UseFormReturn<ApplicationFormData>;
}

export const VideoUploadSection = ({ form }: VideoUploadSectionProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/wmv', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a video file (MP4, MOV, AVI, WMV, or WebM)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please upload a video file smaller than 100MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await uploadVideoFile(file, `demo-reel-${Date.now()}.${file.name.split('.').pop()}`);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        form.setValue('videoUpload', result.url);
        toast({
          title: "Video Uploaded Successfully",
          description: "Your demo reel has been uploaded and is ready for review.",
        });
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload Error",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemoveVideo = () => {
    form.setValue('videoUpload', '');
    toast({
      title: "Video Removed",
      description: "Your uploaded video has been removed.",
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
                Link to your online portfolio (Vimeo, YouTube, Behance, or personal website)
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
                          Supported formats: MP4, MOV, AVI, WMV, WebM (Max 100MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVideoUpload(file);
                        }}
                        disabled={isUploading}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer mt-4"
                      />
                      {isUploading && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Uploading... {uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium text-green-800">Demo reel uploaded successfully</p>
                          <p className="text-xs text-green-600">Ready for review</p>
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
