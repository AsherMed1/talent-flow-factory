
import React, { memo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApplications } from '@/hooks/useApplications';

const RecentActivity = memo(() => {
  const { data: applications, isLoading, error, dataUpdatedAt } = useApplications();

  useEffect(() => {
    console.log('🏠 RecentActivity component data updated at:', new Date(dataUpdatedAt));
    console.log('🏠 Applications data in RecentActivity:', {
      total: applications?.length || 0,
      isLoading,
      error: error?.message,
      firstFew: applications?.slice(0, 3).map(app => ({
        id: app.id,
        name: app.candidate?.name,
        status: app.status,
        appliedDate: app.applied_date,
        jobRole: app.job_role?.name
      }))
    });
  }, [applications, isLoading, error, dataUpdatedAt]);

  const recentActivity = applications?.slice(0, 4).map(app => ({
    action: `${app.status === 'applied' ? 'New application from' : 
             app.status === 'interview_scheduled' ? 'Interview scheduled with' :
             app.status === 'offer_sent' ? 'Offer sent to' : 
             'Updated application for'} ${app.candidate.name}`,
    role: app.job_role?.name || 'Unknown Role',
    time: new Date(app.applied_date).toLocaleDateString()
  })) || [];

  console.log('🏠 Recent activity items:', recentActivity);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            Loading recent activity...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.error('🏠 Error in RecentActivity:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500 py-8">
            Error loading recent activity: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

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
});

RecentActivity.displayName = 'RecentActivity';

export default RecentActivity;
