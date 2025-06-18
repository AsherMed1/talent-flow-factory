
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Edit, Eye } from 'lucide-react';
import { JobRole, useUpdateJobRole } from '@/hooks/useJobRoles';
import { useToast } from '@/hooks/use-toast';
import { RoleEditForm } from './RoleEditForm';
import { RoleCardContent } from './RoleCardContent';

interface RoleCardProps {
  role: JobRole;
}

export const RoleCard = ({ role }: RoleCardProps) => {
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editRole, setEditRole] = useState({ 
    name: '', 
    description: '', 
    booking_link: '',
    hiring_process: '',
    screening_questions: '',
    job_description: '',
    ai_tone_prompt: ''
  });
  
  const updateRoleMutation = useUpdateJobRole();
  const { toast } = useToast();

  const handleEditRole = (role: JobRole) => {
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

  const handlePreview = () => {
    const previewUrl = `/apply/${role.id}`;
    window.open(previewUrl, '_blank');
  };

  const formFields = Array.isArray(role.form_fields) ? role.form_fields : [];
  const isEditing = editingRole === role.id;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {isEditing ? (
              <div className="w-full">
                <RoleEditForm 
                  editRole={editRole} 
                  setEditRole={setEditRole}
                />
              </div>
            ) : (
              role.name
            )}
          </CardTitle>
          {!isEditing && (
            <Badge 
              variant={role.status === 'active' ? 'default' : 'secondary'}
              className={role.status === 'active' ? 'bg-green-100 text-green-800' : ''}
            >
              {role.status}
            </Badge>
          )}
        </div>
        {!isEditing && (
          <div className="text-sm text-gray-600">
            {role.description}
          </div>
        )}
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

        {!isEditing && <RoleCardContent role={role} />}
        
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
              <Button size="sm" variant="outline" onClick={handlePreview}>
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
};
