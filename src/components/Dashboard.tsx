import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Calendar, TrendingUp, GitBranch } from 'lucide-react';

export const Dashboard = () => {
  const stats = [
    { label: 'Active Applications', value: '24', icon: Users, color: 'text-blue-600' },
    { label: 'Interviews This Week', value: '8', icon: Calendar, color: 'text-purple-600' },
    { label: 'Hired This Month', value: '3', icon: UserCheck, color: 'text-green-600' },
    { label: 'Conversion Rate', value: '12.5%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const recentActivity = [
    { action: 'New application from Sarah Johnson', role: 'Appointment Setter', time: '2 hours ago' },
    { action: 'Interview scheduled with Mike Chen', role: 'Virtual Assistant', time: '4 hours ago' },
    { action: 'Offer sent to Emma Davis', role: 'Appointment Setter', time: '1 day ago' },
    { action: 'New role template created', role: 'Sales Closer', time: '2 days ago' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hiring Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <GitBranch className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900">Create New Role</h3>
                <p className="text-sm text-gray-500">Set up a new hiring workflow</p>
              </div>
            </button>
            
            <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Add Candidate</h3>
                <p className="text-sm text-gray-500">Manually add a new applicant</p>
              </div>
            </button>
            
            <button className="p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">Schedule Interview</h3>
                <p className="text-sm text-gray-500">Book time with candidates</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">Role: {activity.role}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
