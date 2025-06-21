
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useJobRoles } from '@/hooks/useJobRoles';
import { RoleCreateForm } from './role-manager/RoleCreateForm';
import { RoleCard } from './role-manager/RoleCard';
import { LoadingSkeleton } from './role-manager/LoadingSkeleton';

export const RoleManager = () => {
  console.log('RoleManager component rendering...');
  
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  
  // Add error boundary for the useJobRoles hook
  let rolesQuery;
  try {
    console.log('Calling useJobRoles hook...');
    rolesQuery = useJobRoles();
    console.log('useJobRoles hook result:', rolesQuery);
  } catch (error) {
    console.error('Error calling useJobRoles hook:', error);
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Roles</h2>
          <p className="text-red-600 mt-2">
            There was an error loading the job roles. Please check the console for details.
          </p>
          <pre className="text-xs text-red-500 mt-2 overflow-auto">
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </div>
      </div>
    );
  }

  const { data: roles, isLoading, error } = rolesQuery;

  // Listen for the custom event to open the create form
  React.useEffect(() => {
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

  if (error) {
    console.error('RoleManager query error:', error);
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error Loading Roles</h2>
          <p className="text-red-600 mt-2">
            Failed to load job roles: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-3"
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  console.log('RoleManager rendering with roles:', roles);

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
