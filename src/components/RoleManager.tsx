
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Edit, Eye } from 'lucide-react';

export const RoleManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', description: '' });

  const roles = [
    {
      id: 1,
      name: 'Appointment Setter',
      description: 'Schedule appointments and manage client outreach',
      status: 'Active',
      applicants: 15,
      created: '2024-01-15',
      formFields: ['Basic Info', 'Voice Recording', 'Availability', 'Experience'],
    },
    {
      id: 2,
      name: 'Virtual Assistant',
      description: 'Provide administrative support and manage tasks',
      status: 'Active',
      applicants: 8,
      created: '2024-02-01',
      formFields: ['Basic Info', 'Portfolio', 'Skills Assessment', 'Time Zone'],
    },
    {
      id: 3,
      name: 'Sales Closer',
      description: 'Close sales calls and convert qualified leads',
      status: 'Draft',
      applicants: 0,
      created: '2024-03-10',
      formFields: ['Basic Info', 'Sales Experience', 'Video Pitch', 'Objection Handling'],
    },
  ];

  const handleCreateRole = () => {
    console.log('Creating new role:', newRole);
    setShowCreateForm(false);
    setNewRole({ name: '', description: '' });
  };

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Role Name</label>
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
            <div className="flex gap-2">
              <Button onClick={handleCreateRole}>Create Role</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{role.name}</CardTitle>
                <Badge 
                  variant={role.status === 'Active' ? 'default' : 'secondary'}
                  className={role.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                >
                  {role.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{role.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Applicants:</span>
                  <span className="ml-2 font-semibold">{role.applicants}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Created:</span>
                  <span className="ml-2">{role.created}</span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-gray-500 text-sm">Form Fields:</span>
                <div className="flex flex-wrap gap-1 mt-2">
                  {role.formFields.map((field, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4 mr-1" />
                  Clone
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
