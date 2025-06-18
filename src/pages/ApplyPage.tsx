
import { useParams } from 'react-router-dom';
import { ApplicationForm } from '@/components/ApplicationForm';
import { useJobRoles } from '@/hooks/useJobRoles';

export const ApplyPage = () => {
  const { roleId } = useParams();
  const { data: roles, isLoading } = useJobRoles();
  
  console.log('ApplyPage - roleId from URL:', roleId);
  console.log('ApplyPage - available roles:', roles);
  
  const role = roles?.find(r => r.id === roleId);
  console.log('ApplyPage - matched role:', role);

  if (isLoading) {
    console.log('ApplyPage - still loading roles...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the application form.</p>
        </div>
      </div>
    );
  }

  if (roleId && !role) {
    console.log('ApplyPage - Role not found. Available role IDs:');
    roles?.forEach(r => console.log(`- ${r.name}: ${r.id}`));
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Role Not Found</h1>
          <p className="text-gray-600">The position you're looking for doesn't exist or is no longer available.</p>
          <p className="text-sm text-gray-500 mt-2">Role ID: {roleId}</p>
        </div>
      </div>
    );
  }

  console.log('ApplyPage - Rendering ApplicationForm with role:', role);

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicationForm jobRoleId={roleId} role={role} />
    </div>
  );
};
