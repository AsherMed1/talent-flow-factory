
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { VoiceRecorder } from './VoiceRecorder';
import { Upload } from 'lucide-react';

const applicationSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  location: z.string().min(1, 'Location is required'),
  
  // Availability
  weekendAvailability: z.string().min(1, 'Weekend availability is required'),
  
  // Voice Recordings
  introductionRecording: z.string().optional(),
  scriptRecording: z.string().optional(),
  
  // File Uploads
  downloadSpeedScreenshot: z.any().optional(),
  uploadSpeedScreenshot: z.any().optional(),
  workstationPhoto: z.any().optional(),
  
  // Listening Comprehension
  husbandName: z.enum(['Mark', 'Steve', 'Joesph', 'Bob'], {
    required_error: 'Please select an answer',
  }),
  treatmentNotDone: z.enum(['Shots', 'Knee Replacement Surgery', 'Physical Therapy'], {
    required_error: 'Please select an answer',
  }),
  
  // Agreement
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  jobRoleId?: string;
  onSuccess?: () => void;
}

const STORAGE_KEY = 'application-form-data';
const VOICE_STORAGE_KEY = 'application-voice-recording';

export const ApplicationForm = ({ jobRoleId, onSuccess }: ApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [introductionRecording, setIntroductionRecording] = useState<{
    blob: Blob;
    url: string;
  } | null>(null);
  const [scriptRecording, setScriptRecording] = useState<{
    blob: Blob;
    url: string;
  } | null>(null);
  const [currentRecordingType, setCurrentRecordingType] = useState<'introduction' | 'script' | null>(null);
  
  const { toast } = useToast();
  
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  // Auto-save functionality
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key] !== undefined && parsedData[key] !== '') {
            form.setValue(key as keyof ApplicationFormData, parsedData[key]);
          }
        });
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    }
  }, [form]);

  const watchedValues = form.watch();
  useEffect(() => {
    try {
      const dataToSave = Object.fromEntries(
        Object.entries(watchedValues).filter(([_, value]) => 
          value !== undefined && value !== '' && value !== false
        )
      );
      
      if (Object.keys(dataToSave).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      }
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [watchedValues]);

  const handleVoiceRecording = (audioBlob: Blob, audioUrl: string) => {
    if (currentRecordingType === 'introduction') {
      setIntroductionRecording({ blob: audioBlob, url: audioUrl });
      toast({
        title: "Introduction Recording Captured",
        description: "Your introduction recording has been captured successfully.",
      });
    } else if (currentRecordingType === 'script') {
      setScriptRecording({ blob: audioBlob, url: audioUrl });
      toast({
        title: "Script Recording Captured",
        description: "Your script recording has been captured successfully.",
      });
    }
    setCurrentRecordingType(null);
  };

  const handleFileUpload = (file: File, fieldName: string) => {
    form.setValue(fieldName as keyof ApplicationFormData, file);
    toast({
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    console.log('Submitting application:', data);

    try {
      // Create or find the candidate
      const fullName = `${data.firstName} ${data.lastName}`;
      
      let candidateId: string;
      
      const { data: existingCandidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingCandidate) {
        candidateId = existingCandidate.id;
        
        await supabase
          .from('candidates')
          .update({
            name: fullName,
            updated_at: new Date().toISOString(),
          })
          .eq('id', candidateId);
      } else {
        const { data: newCandidate, error: candidateError } = await supabase
          .from('candidates')
          .insert({
            name: fullName,
            email: data.email,
          })
          .select('id')
          .single();

        if (candidateError) throw candidateError;
        candidateId = newCandidate.id;
      }

      // Get job role ID
      let roleId = jobRoleId;
      if (!roleId) {
        const { data: appointmentSetterRole } = await supabase
          .from('job_roles')
          .select('id')
          .eq('name', 'Appointment Setter')
          .single();
        
        roleId = appointmentSetterRole?.id;
      }

      // Prepare form data
      const formData = {
        basicInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          location: data.location,
        },
        availability: {
          weekendAvailability: data.weekendAvailability,
        },
        voiceRecordings: {
          hasIntroduction: !!introductionRecording,
          hasScript: !!scriptRecording,
        },
        listeningComprehension: {
          husbandName: data.husbandName,
          treatmentNotDone: data.treatmentNotDone,
        },
        uploads: {
          hasDownloadSpeed: !!data.downloadSpeedScreenshot,
          hasUploadSpeed: !!data.uploadSpeedScreenshot,
          hasWorkstation: !!data.workstationPhoto,
        },
      };

      // Create application
      const { data: newApplication, error: applicationError } = await supabase
        .from('applications')
        .insert({
          candidate_id: candidateId,
          job_role_id: roleId,
          status: 'applied',
          form_data: formData,
          has_voice_recording: !!(introductionRecording || scriptRecording),
          notes: `Remote Appointment Setter application. Location: ${data.location}. Weekend availability: ${data.weekendAvailability}. Listening test completed.`,
        })
        .select('id')
        .single();

      if (applicationError) throw applicationError;

      // Add tags
      const tags = ['Remote Worker', 'Weekend Available'];
      if (introductionRecording && scriptRecording) tags.push('Voice Submitted');
      
      for (const tag of tags) {
        await supabase
          .from('candidate_tags')
          .insert({
            candidate_id: candidateId,
            tag: tag,
          });
      }

      // Clear saved data
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VOICE_STORAGE_KEY);

      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });

      form.reset();
      setIntroductionRecording(null);
      setScriptRecording(null);
      onSuccess?.();
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(VOICE_STORAGE_KEY);
    form.reset();
    setIntroductionRecording(null);
    setScriptRecording(null);
    toast({
      title: "Form Cleared",
      description: "All saved form data has been cleared.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Appointment Setter – Remote</CardTitle>
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold text-blue-600">(Must Be Available Weekends + Bonuses!)</p>
            <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-2">
              <p><strong>What We Offer:</strong></p>
              <p>✅ Fully remote position with flexible hours (must be available weekends)</p>
              <p>✅ Opportunity for performance bonuses & career growth</p>
              <p>✅ Supportive, world-class team focused on your success</p>
              <p className="font-semibold text-green-600">💰 Pay: $5/hr + performance bonuses</p>
            </div>
          </div>
          
          {/* Auto-save notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
            <strong>Auto-save enabled:</strong> Your form data is automatically saved as you type.
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearSavedData}
              className="ml-2 text-xs"
            >
              Clear Saved Data
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...form.register('firstName')}
                    placeholder="Justin"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...form.register('lastName')}
                    placeholder="Lesh"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="justinlesh1@gmail.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="location">Where do you live (City, State, Country)</Label>
                <Input
                  id="location"
                  {...form.register('location')}
                  placeholder="e.g., Miami, FL, USA"
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="weekendAvailability">Are You Available To Work Weekends? (Saturday /Sunday)</Label>
                <Textarea
                  id="weekendAvailability"
                  {...form.register('weekendAvailability')}
                  placeholder="Please describe your weekend availability"
                  className="mt-2"
                />
                {form.formState.errors.weekendAvailability && (
                  <p className="text-sm text-red-600">{form.formState.errors.weekendAvailability.message}</p>
                )}
              </div>
            </div>

            {/* Voice Recordings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Voice Recordings</h3>
              <p className="text-sm text-gray-600">
                For the next two questions, please record yourself using the voice recorder below.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">
                    Please Provide a Voice Recording Of Yourself. Just Tell Us a Little About You and Your Experience.
                  </Label>
                  <div className="mt-2">
                    {!introductionRecording ? (
                      <Button
                        type="button"
                        onClick={() => setCurrentRecordingType('introduction')}
                        disabled={currentRecordingType !== null}
                        className="mb-2"
                      >
                        Record Introduction
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm text-green-600 font-medium">
                          ✓ Introduction recording captured
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentRecordingType('introduction')}
                          disabled={currentRecordingType !== null}
                        >
                          Re-record Introduction
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-base font-medium">
                    Record Yourself Confirming Call Script:
                  </Label>
                  <div className="bg-gray-50 p-3 rounded-md text-sm italic my-2">
                    "Hey Susan, just a quick check-in to confirm your appointment for tomorrow.—it's {"{Your Name}"} from Apex Vascular. You're all set for your knee pain consultation with Dr. Pollock tomorrow at 2 PM! We're excited to see you and get you on the path to feeling better. Let me know if anything comes up—otherwise, see you then!"
                  </div>
                  <div className="mt-2">
                    {!scriptRecording ? (
                      <Button
                        type="button"
                        onClick={() => setCurrentRecordingType('script')}
                        disabled={currentRecordingType !== null}
                        className="mb-2"
                      >
                        Record Script
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm text-green-600 font-medium">
                          ✓ Script recording captured
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setCurrentRecordingType('script')}
                          disabled={currentRecordingType !== null}
                        >
                          Re-record Script
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {currentRecordingType && (
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2">
                      Recording: {currentRecordingType === 'introduction' ? 'Introduction' : 'Call Script'}
                    </h4>
                    <VoiceRecorder 
                      onRecordingComplete={handleVoiceRecording}
                      disabled={isSubmitting}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* File Uploads */}
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

            {/* Listening Comprehension */}
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

            {/* Terms Agreement */}
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

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isSubmitting ? 'Submitting...' : 'Submit!'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
