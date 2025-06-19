
import { ApplicationForm } from '@/components/ApplicationForm';
import { useJobRoles } from '@/hooks/useJobRoles';

export const VideoEditorApplicationPage = () => {
  const { data: roles, isLoading } = useJobRoles();
  
  const videoEditorRole = roles?.find(role => 
    role.name.toLowerCase().includes('video editor') || 
    role.name.toLowerCase().includes('video-editor')
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the Video Editor application form.</p>
        </div>
      </div>
    );
  }

  if (!videoEditorRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Video Editor Position Not Available</h1>
          <p className="text-gray-600">The Video Editor position is not currently available or has been filled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicationForm jobRoleId={videoEditorRole.id} role={videoEditorRole} />
    </div>
  );
};
