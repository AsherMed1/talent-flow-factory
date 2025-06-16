
import { useParams } from 'react-router-dom';
import { ApplicationForm } from '@/components/ApplicationForm';
import { useJobRoles } from '@/hooks/useJobRoles';

export const ApplyPage = () => {
  const { roleId } = useParams();
  const { data: roles } = useJobRoles();
  
  const role = roles?.find(r => r.id === roleId);

  if (roleId && !role) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Role Not Found</h1>
          <p className="text-gray-600">The position you're looking for doesn't exist or is no longer available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicationForm jobRoleId={roleId} />
    </div>
  );
};
