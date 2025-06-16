import { useState } from 'react';
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

const applicationSchema = z.object({
  // Basic Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  
  // Experience Questions
  appointmentSettingExperience: z.enum(['yes', 'no']),
  experienceDetails: z.string().optional(),
  currentlyWorking: z.enum(['yes', 'no']),
  currentWorkDetails: z.string().optional(),
  
  // Availability
  hoursPerWeek: z.string().min(1, 'Hours per week is required'),
  startDate: z.string().min(1, 'Start date is required'),
  timeZone: z.string().min(1, 'Time zone is required'),
  
  // Work Setup
  quietWorkspace: z.enum(['yes', 'no']),
  reliableInternet: z.enum(['yes', 'no']),
  computerAccess: z.enum(['yes', 'no']),
  
  // Motivation & Fit
  whyThisRole: z.string().min(10, 'Please provide a detailed answer'),
  strengths: z.string().min(10, 'Please describe your strengths'),
  challengingScenario: z.string().min(10, 'Please describe how you handle challenges'),
  
  // Voice Recording
  voiceRecordingUrl: z.string().optional(),
  voiceRecordingNotes: z.string().optional(),
  
  // Additional
  additionalInfo: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  jobRoleId?: string;
  onSuccess?: () => void;
}

export const ApplicationForm = ({ jobRoleId, onSuccess }: ApplicationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    console.log('Submitting application:', data);

    try {
      // First, create or find the candidate
      const fullName = `${data.firstName} ${data.lastName}`;
      
      let candidateId: string;
      
      // Check if candidate already exists
      const { data: existingCandidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('email', data.email)
        .single();

      if (existingCandidate) {
        candidateId = existingCandidate.id;
        
        // Update candidate info
        await supabase
          .from('candidates')
          .update({
            name: fullName,
            phone: data.phone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', candidateId);
      } else {
        // Create new candidate
        const { data: newCandidate, error: candidateError } = await supabase
          .from('candidates')
          .insert({
            name: fullName,
            email: data.email,
            phone: data.phone,
          })
          .select('id')
          .single();

        if (candidateError) throw candidateError;
        candidateId = newCandidate.id;
      }

      // Get the job role ID (default to appointment setter if not provided)
      let roleId = jobRoleId;
      if (!roleId) {
        const { data: appointmentSetterRole } = await supabase
          .from('job_roles')
          .select('id')
          .eq('name', 'Appointment Setter')
          .single();
        
        roleId = appointmentSetterRole?.id;
      }

      // Prepare form data for storage
      const formData = {
        experience: {
          appointmentSetting: data.appointmentSettingExperience,
          details: data.experienceDetails,
          currentlyWorking: data.currentlyWorking,
          currentWorkDetails: data.currentWorkDetails,
        },
        availability: {
          hoursPerWeek: data.hoursPerWeek,
          startDate: data.startDate,
          timeZone: data.timeZone,
        },
        workSetup: {
          quietWorkspace: data.quietWorkspace,
          reliableInternet: data.reliableInternet,
          computerAccess: data.computerAccess,
        },
        responses: {
          whyThisRole: data.whyThisRole,
          strengths: data.strengths,
          challengingScenario: data.challengingScenario,
          additionalInfo: data.additionalInfo,
        },
        voiceRecording: {
          url: data.voiceRecordingUrl,
          notes: data.voiceRecordingNotes,
        },
      };

      // Create application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          candidate_id: candidateId,
          job_role_id: roleId,
          status: 'applied',
          form_data: formData,
          has_voice_recording: !!data.voiceRecordingUrl,
          notes: `Application submitted for Appointment Setter position. Time zone: ${data.timeZone}, Available hours: ${data.hoursPerWeek}/week`,
        });

      if (applicationError) throw applicationError;

      // Add relevant tags based on responses
      const tags = [];
      if (data.appointmentSettingExperience === 'yes') tags.push('Experienced');
      if (data.currentlyWorking === 'no') tags.push('Available Immediately');
      if (data.voiceRecordingUrl) tags.push('Voice Submitted');
      
      // Add tags to candidate
      for (const tag of tags) {
        await supabase
          .from('candidate_tags')
          .insert({
            candidate_id: candidateId,
            tag: tag,
          });
      }

      toast({
        title: "Application Submitted Successfully!",
        description: "Thank you for your interest. We'll review your application and get back to you soon.",
      });

      form.reset();
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Appointment Setter Application</CardTitle>
          <p className="text-center text-gray-600">
            Join our team and help connect patients with quality healthcare providers
          </p>
        </CardHeader>
        <CardContent>
          {/* Video Section */}
          <div className="mb-8">
            <div style={{ position: 'relative', paddingBottom: '51.354166666666664%', height: 0 }} className="w-full max-w-2xl mx-auto">
              <iframe 
                src="https://www.loom.com/embed/646c1476756c4fc3a96255e0a3a1c6ee?sid=f5ccf346-0d0a-4992-8ae6-59f7d12ce4af" 
                frameBorder="0" 
                allowFullScreen 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                title="About This Position"
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Watch this video to learn more about the appointment setter position
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    {...form.register('firstName')}
                    placeholder="Your first name"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-sm text-red-600">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    {...form.register('lastName')}
                    placeholder="Your last name"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-sm text-red-600">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  placeholder="your.email@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  placeholder="(555) 123-4567"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-600">{form.formState.errors.phone.message}</p>
                )}
              </div>
            </div>

            {/* Experience Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Experience & Background</h3>
              
              <div>
                <Label>Do you have experience in appointment setting or cold calling? *</Label>
                <RadioGroup 
                  value={form.watch('appointmentSettingExperience')} 
                  onValueChange={(value) => form.setValue('appointmentSettingExperience', value as 'yes' | 'no')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="exp-yes" />
                    <Label htmlFor="exp-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="exp-no" />
                    <Label htmlFor="exp-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="experienceDetails">If yes, please describe your experience:</Label>
                <Textarea
                  id="experienceDetails"
                  {...form.register('experienceDetails')}
                  placeholder="Describe your relevant experience..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Are you currently working? *</Label>
                <RadioGroup 
                  value={form.watch('currentlyWorking')} 
                  onValueChange={(value) => form.setValue('currentlyWorking', value as 'yes' | 'no')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="work-yes" />
                    <Label htmlFor="work-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="work-no" />
                    <Label htmlFor="work-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="currentWorkDetails">If yes, please describe your current work situation:</Label>
                <Textarea
                  id="currentWorkDetails"
                  {...form.register('currentWorkDetails')}
                  placeholder="Describe your current work situation..."
                  className="mt-2"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Availability</h3>
              
              <div>
                <Label htmlFor="hoursPerWeek">How many hours per week are you available to work? *</Label>
                <Input
                  id="hoursPerWeek"
                  {...form.register('hoursPerWeek')}
                  placeholder="e.g., 20-40 hours"
                />
                {form.formState.errors.hoursPerWeek && (
                  <p className="text-sm text-red-600">{form.formState.errors.hoursPerWeek.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="startDate">When can you start? *</Label>
                <Input
                  id="startDate"
                  {...form.register('startDate')}
                  placeholder="e.g., Immediately, 2 weeks notice, etc."
                />
                {form.formState.errors.startDate && (
                  <p className="text-sm text-red-600">{form.formState.errors.startDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="timeZone">What time zone are you in? *</Label>
                <Input
                  id="timeZone"
                  {...form.register('timeZone')}
                  placeholder="e.g., EST, PST, CST"
                />
                {form.formState.errors.timeZone && (
                  <p className="text-sm text-red-600">{form.formState.errors.timeZone.message}</p>
                )}
              </div>
            </div>

            {/* Work Setup */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Work Environment</h3>
              
              <div>
                <Label>Do you have a quiet workspace for making calls? *</Label>
                <RadioGroup 
                  value={form.watch('quietWorkspace')} 
                  onValueChange={(value) => form.setValue('quietWorkspace', value as 'yes' | 'no')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="quiet-yes" />
                    <Label htmlFor="quiet-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="quiet-no" />
                    <Label htmlFor="quiet-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Do you have reliable internet access? *</Label>
                <RadioGroup 
                  value={form.watch('reliableInternet')} 
                  onValueChange={(value) => form.setValue('reliableInternet', value as 'yes' | 'no')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="internet-yes" />
                    <Label htmlFor="internet-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="internet-no" />
                    <Label htmlFor="internet-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Do you have access to a computer/laptop? *</Label>
                <RadioGroup 
                  value={form.watch('computerAccess')} 
                  onValueChange={(value) => form.setValue('computerAccess', value as 'yes' | 'no')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="computer-yes" />
                    <Label htmlFor="computer-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="computer-no" />
                    <Label htmlFor="computer-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Motivation & Fit */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">About You</h3>
              
              <div>
                <Label htmlFor="whyThisRole">Why are you interested in this appointment setting role? *</Label>
                <Textarea
                  id="whyThisRole"
                  {...form.register('whyThisRole')}
                  placeholder="Tell us why you're interested in this position..."
                  className="mt-2"
                />
                {form.formState.errors.whyThisRole && (
                  <p className="text-sm text-red-600">{form.formState.errors.whyThisRole.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="strengths">What are your key strengths that would make you successful in this role? *</Label>
                <Textarea
                  id="strengths"
                  {...form.register('strengths')}
                  placeholder="Describe your relevant strengths..."
                  className="mt-2"
                />
                {form.formState.errors.strengths && (
                  <p className="text-sm text-red-600">{form.formState.errors.strengths.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="challengingScenario">Describe a challenging situation you've handled and how you overcame it: *</Label>
                <Textarea
                  id="challengingScenario"
                  {...form.register('challengingScenario')}
                  placeholder="Share an example of how you handle challenges..."
                  className="mt-2"
                />
                {form.formState.errors.challengingScenario && (
                  <p className="text-sm text-red-600">{form.formState.errors.challengingScenario.message}</p>
                )}
              </div>
            </div>

            {/* Voice Recording */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Voice Recording</h3>
              <p className="text-sm text-gray-600">
                Please record a 2-3 minute voice message introducing yourself and explaining why you'd be great for this role.
              </p>
              
              <div>
                <Label htmlFor="voiceRecordingUrl">Voice Recording URL (upload to Google Drive, Dropbox, etc.)</Label>
                <Input
                  id="voiceRecordingUrl"
                  {...form.register('voiceRecordingUrl')}
                  placeholder="https://drive.google.com/file/..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="voiceRecordingNotes">Additional notes about your recording:</Label>
                <Textarea
                  id="voiceRecordingNotes"
                  {...form.register('voiceRecordingNotes')}
                  placeholder="Any additional context about your voice recording..."
                  className="mt-2"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div>
                <Label htmlFor="additionalInfo">Is there anything else you'd like us to know?</Label>
                <Textarea
                  id="additionalInfo"
                  {...form.register('additionalInfo')}
                  placeholder="Any additional information you'd like to share..."
                  className="mt-2"
                />
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
                {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
