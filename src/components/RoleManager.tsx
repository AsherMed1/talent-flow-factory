
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Copy, Edit, Eye, ExternalLink } from 'lucide-react';
import { useJobRoles, useCreateJobRole, useUpdateJobRole } from '@/hooks/useJobRoles';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export const RoleManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ 
    name: '', 
    description: '', 
    booking_link: '',
    hiring_process: '',
    screening_questions: '',
    job_description: '',
    ai_tone_prompt: ''
  });
  const [editRole, setEditRole] = useState({ 
    name: '', 
    description: '', 
    booking_link: '',
    hiring_process: '',
    screening_questions: '',
    job_description: '',
    ai_tone_prompt: ''
  });
  const { data: roles, isLoading } = useJobRoles();
  const createRoleMutation = useCreateJobRole();
  const updateRoleMutation = useUpdateJobRole();
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
      await createRoleMutation.mutateAsync(newRole);
      toast({
        title: "Success",
        description: "Role created successfully"
      });
      setShowCreateForm(false);
      setNewRole({ 
        name: '', 
        description: '', 
        booking_link: '',
        hiring_process: '',
        screening_questions: '',
        job_description: '',
        ai_tone_prompt: ''
      });
    } catch (error) {
      console.error('Create role error:', error);
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive"
      });
    }
  };

  const handleEditRole = (role: any) => {
    console.log('Editing role:', role);
    setEditingRole(role.id);
    setEditRole({
      name: role.name,
      description: role.description || '',
      booking_link: role.booking_link || '',
      hiring_process: role.hiring_process || '',
      screening_questions: role.screening_questions || '',
      job_description: role.job_description || '',
      ai_tone_prompt: role.ai_tone_prompt || ''
    });
  };

  const handleUpdateRole = async () => {
    if (!editRole.name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive"
      });
      return;
    }

    if (!editingRole) {
      toast({
        title: "Error",
        description: "No role selected for editing",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Updating role with data:', {
        id: editingRole,
        ...editRole
      });

      await updateRoleMutation.mutateAsync({
        id: editingRole,
        ...editRole
      });
      
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
      setEditingRole(null);
    } catch (error) {
      console.error('Update role error:', error);
      toast({
        title: "Error",
        description: `Failed to update role: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Role Templates</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Role Templates</h1>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Role
        </Button>
      </div>

      {showCreateForm && (
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
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6">
        {roles?.map((role) => {
          const formFields = Array.isArray(role.form_fields) ? role.form_fields : [];
          const isEditing = editingRole === role.id;
          
          return (
            <Card key={role.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {isEditing ? (
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Role Name *</Label>
                        <Input
                          value={editRole.name}
                          onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                          className="text-lg font-semibold mt-1"
                        />
                      </div>
                    ) : (
                      role.name
                    )}
                  </CardTitle>
                  <Badge 
                    variant={role.status === 'active' ? 'default' : 'secondary'}
                    className={role.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  >
                    {role.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {isEditing ? (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Description</Label>
                      <Input
                        value={editRole.description}
                        onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
                        placeholder="Description"
                        className="mt-1"
                      />
                    </div>
                  ) : (
                    role.description
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Applicants:</span>
                    <span className="ml-2 font-semibold">0</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Created:</span>
                    <span className="ml-2">{new Date(role.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Custom Booking Link</Label>
                      <Input
                        value={editRole.booking_link}
                        onChange={(e) => setEditRole({ ...editRole, booking_link: e.target.value })}
                        placeholder="e.g., https://calendly.com/yourname/interview"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Hiring Process</Label>
                      <Textarea
                        value={editRole.hiring_process}
                        onChange={(e) => setEditRole({ ...editRole, hiring_process: e.target.value })}
                        className="mt-1 min-h-20"
                        placeholder="Describe your hiring process steps..."
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Screening Questions</Label>
                      <Textarea
                        value={editRole.screening_questions}
                        onChange={(e) => setEditRole({ ...editRole, screening_questions: e.target.value })}
                        className="mt-1 min-h-20"
                        placeholder="Position-specific screening requirements..."
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Job Description</Label>
                      <Textarea
                        value={editRole.job_description}
                        onChange={(e) => setEditRole({ ...editRole, job_description: e.target.value })}
                        className="mt-1 min-h-24"
                        placeholder="Full job description..."
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">AI Analysis Tone</Label>
                      <Textarea
                        value={editRole.ai_tone_prompt}
                        onChange={(e) => setEditRole({ ...editRole, ai_tone_prompt: e.target.value })}
                        className="mt-1 min-h-20"
                        placeholder="Define AI expertise for this role..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-500 text-sm">Booking Link:</span>
                      {role.booking_link ? (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded flex-1 truncate">
                            {role.booking_link}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(role.booking_link, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400 italic mt-1">No custom booking link set</div>
                      )}
                    </div>

                    {role.hiring_process && (
                      <div>
                        <span className="font-medium text-gray-500 text-sm">Hiring Process:</span>
                        <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                          {role.hiring_process.slice(0, 150)}{role.hiring_process.length > 150 ? '...' : ''}
                        </div>
                      </div>
                    )}

                    {role.ai_tone_prompt && (
                      <div>
                        <span className="font-medium text-gray-500 text-sm">AI Expertise:</span>
                        <div className="text-xs text-purple-600 mt-1 bg-purple-50 p-2 rounded">
                          {role.ai_tone_prompt.slice(0, 100)}{role.ai_tone_prompt.length > 100 ? '...' : ''}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-gray-500 text-sm">Form Fields:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formFields.map((field: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {field.name || field}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2 border-t">
                  {isEditing ? (
                    <>
                      <Button 
                        size="sm" 
                        onClick={handleUpdateRole}
                        disabled={updateRoleMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {updateRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setEditingRole(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditRole(role)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="w-4 h-4 mr-1" />
                        Clone
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
