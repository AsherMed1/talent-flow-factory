
import { ApplicationForm } from '@/components/ApplicationForm';
import { useJobRoles } from '@/hooks/useJobRoles';

export const AppointmentSetterApplicationPage = () => {
  const { data: roles, isLoading } = useJobRoles();
  
  const appointmentSetterRole = roles?.find(role => 
    role.name.toLowerCase().includes('appointment setter') || 
    role.name.toLowerCase().includes('appointment-setter')
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we load the Appointment Setter application form.</p>
        </div>
      </div>
    );
  }

  if (!appointmentSetterRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Appointment Setter Position Not Available</h1>
          <p className="text-gray-600">The Appointment Setter position is not currently available or has been filled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicationForm jobRoleId={appointmentSetterRole.id} role={appointmentSetterRole} />
    </div>
  );
};
