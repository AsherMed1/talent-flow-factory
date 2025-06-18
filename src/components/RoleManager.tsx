
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Edit, Eye, ExternalLink } from 'lucide-react';
import { useJobRoles, useCreateJobRole, useUpdateJobRole } from '@/hooks/useJobRoles';
import { useToast } from '@/hooks/use-toast';

export const RoleManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ name: '', description: '', booking_link: '' });
  const [editRole, setEditRole] = useState({ name: '', description: '', booking_link: '' });
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
      setNewRole({ name: '', description: '', booking_link: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive"
      });
    }
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role.id);
    setEditRole({
      name: role.name,
      description: role.description || '',
      booking_link: role.booking_link || ''
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

    try {
      await updateRoleMutation.mutateAsync({
        id: editingRole!,
        ...editRole
      });
      toast({
        title: "Success",
        description: "Role updated successfully"
      });
      setEditingRole(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
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
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
              <Input
                placeholder="e.g., Customer Success Manager"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <Input
                placeholder="Brief description of the role"
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Booking Link
                <span className="text-xs text-gray-500 block">Used for interview scheduling emails for this role</span>
              </label>
              <Input
                placeholder="e.g., https://calendly.com/yourname/interview"
                value={newRole.booking_link}
                onChange={(e) => setNewRole({ ...newRole, booking_link: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCreateRole}
                disabled={createRoleMutation.isPending}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
                        <Input
                          value={editRole.name}
                          onChange={(e) => setEditRole({ ...editRole, name: e.target.value })}
                          className="text-lg font-semibold"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <Input
                        value={editRole.description}
                        onChange={(e) => setEditRole({ ...editRole, description: e.target.value })}
                        placeholder="Description"
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
                
                <div>
                  <span className="font-medium text-gray-500 text-sm">Custom Booking Link:</span>
                  {isEditing ? (
                    <div className="mt-1">
                      <Input
                        value={editRole.booking_link}
                        onChange={(e) => setEditRole({ ...editRole, booking_link: e.target.value })}
                        placeholder="e.g., https://calendly.com/yourname/interview"
                      />
                      <p className="text-xs text-gray-500 mt-1">This link will be used in interview emails for this role</p>
                    </div>
                  ) : (
                    <div className="mt-1">
                      {role.booking_link ? (
                        <div className="flex items-center gap-2">
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
                        <div className="text-xs text-gray-400 italic">No custom booking link set</div>
                      )}
                    </div>
                  )}
                </div>
                
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
                
                <div className="flex gap-2 pt-2">
                  {isEditing ? (
                    <>
                      <Button 
                        size="sm" 
                        onClick={handleUpdateRole}
                        disabled={updateRoleMutation.isPending}
                      >
                        {updateRoleMutation.isPending ? 'Saving...' : 'Save'}
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
