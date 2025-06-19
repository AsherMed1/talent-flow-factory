import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCreateJobRole, PipelineStage } from '@/hooks/useJobRoles';
import { useToast } from '@/hooks/use-toast';
import { PipelineStagesEditor } from './PipelineStagesEditor';

interface RoleCreateFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

export const RoleCreateForm = ({ onCancel, onSuccess }: RoleCreateFormProps) => {
  const [newRole, setNewRole] = useState({ 
    name: '', 
    description: '', 
    booking_link: '',
    hiring_process: '',
    screening_questions: '',
    job_description: '',
    ai_tone_prompt: ''
  });
  
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([
    {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
    {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
    {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
    {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
    {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
    {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
  ]);
  
  const createRoleMutation = useCreateJobRole();
  const { toast } = useToast();

  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createRoleMutation.mutateAsync({
        ...newRole,
        pipeline_stages: pipelineStages
      });
      toast({
        title: "Success",
        description: "Role created successfully"
      });
      setNewRole({ 
        name: '', 
        description: '', 
        booking_link: '',
        hiring_process: '',
        screening_questions: '',
        job_description: '',
        ai_tone_prompt: ''
      });
      setPipelineStages([
        {"name": "applied", "displayName": "Applied", "color": "bg-gray-100"},
        {"name": "reviewed", "displayName": "Reviewed", "color": "bg-blue-100"},
        {"name": "interview_scheduled", "displayName": "Interview Scheduled", "color": "bg-yellow-100"},
        {"name": "interview_completed", "displayName": "Interview Completed", "color": "bg-purple-100"},
        {"name": "offer_sent", "displayName": "Offer Sent", "color": "bg-green-100"},
        {"name": "hired", "displayName": "Hired", "color": "bg-emerald-100"}
      ]);
      onSuccess();
    } catch (error) {
      console.error('Create role error:', error);
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle>Create New Role Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Role Name *</Label>
              <Input
                placeholder="e.g., Customer Success Manager"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Custom Booking Link</Label>
              <Input
                placeholder="e.g., https://calendly.com/yourname/interview"
                value={newRole.booking_link}
                onChange={(e) => setNewRole({ ...newRole, booking_link: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Used for interview scheduling emails</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Brief Description</Label>
            <Input
              placeholder="Brief description of the role"
              value={newRole.description}
              onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              className="mt-1"
            />
          </div>

          <Separator />

          <div>
            <Label className="text-sm font-medium text-gray-700">Hiring Process Steps</Label>
            <Textarea
              placeholder="Describe your hiring process flow:
• Candidate applies
• Application reviewed & scored
• Send approval/rejection email
• Schedule interview email sent
• Perform interview
• Final interview decision
• Send outcome notification"
              value={newRole.hiring_process}
              onChange={(e) => setNewRole({ ...newRole, hiring_process: e.target.value })}
              className="mt-1 min-h-24"
            />
            <p className="text-xs text-gray-500 mt-1">Outline the steps from application to hire</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Screening Questions & Requirements</Label>
            <Textarea
              placeholder="Position-specific screening requirements:
• Video submission required (2-3 minutes introducing themselves)
• Hypothetical scenarios to answer
• Technical assessments
• Portfolio/work samples
• Specific qualifications to verify"
              value={newRole.screening_questions}
              onChange={(e) => setNewRole({ ...newRole, screening_questions: e.target.value })}
              className="mt-1 min-h-24"
            />
            <p className="text-xs text-gray-500 mt-1">Custom requirements for this position's application</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Job Description & Posting</Label>
            <Textarea
              placeholder="Full job description including:
• Role overview and responsibilities
• Required qualifications and experience
• Company culture and benefits
• Salary range and compensation
• Growth opportunities
(This will be used for AI analysis and throughout the hiring process)"
              value={newRole.job_description}
              onChange={(e) => setNewRole({ ...newRole, job_description: e.target.value })}
              className="mt-1 min-h-32"
            />
            <p className="text-xs text-gray-500 mt-1">Complete job posting for AI analysis and process reference</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">AI Analysis Tone & Expertise</Label>
            <Textarea
              placeholder="Define the AI's expertise for analyzing this role:
'You are an expert B2B sales trainer with 15+ years of experience evaluating appointment setters and inside sales representatives. Focus on communication skills, objection handling, persistence, and phone presence...'

OR

'You are a medical customer service expert specializing in healthcare communication, patient empathy, HIPAA compliance, and clinical terminology understanding...'"
              value={newRole.ai_tone_prompt}
              onChange={(e) => setNewRole({ ...newRole, ai_tone_prompt: e.target.value })}
              className="mt-1 min-h-24"
            />
            <p className="text-xs text-gray-500 mt-1">This prompt guides all AI analysis for this role</p>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button 
              onClick={handleCreateRole}
              disabled={createRoleMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <PipelineStagesEditor 
        stages={pipelineStages}
        onChange={setPipelineStages}
      />
    </div>
  );
};
