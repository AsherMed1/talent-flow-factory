
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApplications } from '@/hooks/useApplications';

const RecentActivity = () => {
  const { data: applications } = useApplications();

  const recentActivity = applications?.slice(0, 4).map(app => ({
    action: `${app.status === 'applied' ? 'New application from' : 
             app.status === 'interview_scheduled' ? 'Interview scheduled with' :
             app.status === 'offer_sent' ? 'Offer sent to' : 
             'Updated application for'} ${app.candidate.name}`,
    role: app.job_role?.name || 'Unknown Role',
    time: new Date(app.applied_date).toLocaleDateString()
  })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">Role: {activity.role}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          )) : (
            <div className="text-center text-gray-500 py-8">
              No recent activity yet. Create your first role to get started!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
