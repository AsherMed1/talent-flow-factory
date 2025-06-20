import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useJobRoles } from '@/hooks/useJobRoles';
import { RoleCreateForm } from './role-manager/RoleCreateForm';
import { RoleCard } from './role-manager/RoleCard';
import { LoadingSkeleton } from './role-manager/LoadingSkeleton';

export const RoleManager = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: roles, isLoading } = useJobRoles();

  // Listen for the custom event to open the create form
  useEffect(() => {
    const handleOpenCreateForm = () => {
      setShowCreateForm(true);
    };

    window.addEventListener('openCreateRoleForm', handleOpenCreateForm);
    
    return () => {
      window.removeEventListener('openCreateRoleForm', handleOpenCreateForm);
    };
  }, []);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
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
        <RoleCreateForm 
          onCancel={() => setShowCreateForm(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      <div className="grid grid-cols-1 gap-6">
        {roles?.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </div>
  );
};
