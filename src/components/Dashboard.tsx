
import { lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Calendar, TrendingUp, GitBranch } from 'lucide-react';
import { useApplicationStats } from '@/hooks/useApplications';
import { EnhancedLoading, PageLoadingSkeleton } from '@/components/ui/enhanced-loading';

// Lazy load heavy dashboard sections
const LazyRecentActivity = lazy(() => import('./dashboard/RecentActivity'));
const LazyQuickActions = lazy(() => import('./dashboard/QuickActions'));

const DashboardSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <Card key={index} className="animate-pulse">
        <CardContent className="p-6">
          <div className="h-16 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const Dashboard = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useApplicationStats();

  const defaultStats = [
    { label: 'Active Applications', value: '0', icon: Users, color: 'text-blue-600' },
    { label: 'Interviews This Week', value: '0', icon: Calendar, color: 'text-purple-600' },
    { label: 'Hired This Month', value: '0', icon: UserCheck, color: 'text-green-600' },
    { label: 'Conversion Rate', value: '0%', icon: TrendingUp, color: 'text-orange-600' },
  ];

  const statsData = stats ? [
    { 
      label: 'Active Applications', 
      value: (stats.activeApplications || stats.active_applications || 0).toString(), 
      icon: Users, 
      color: 'text-blue-600' 
    },
    { 
      label: 'Interviews This Week', 
      value: (stats.interviewsThisWeek || stats.interviews_this_week || 0).toString(), 
      icon: Calendar, 
      color: 'text-purple-600' 
    },
    { 
      label: 'Hired This Month', 
      value: (stats.hiredThisMonth || stats.hired_this_month || 0).toString(), 
      icon: UserCheck, 
      color: 'text-green-600' 
    },
    { 
      label: 'Conversion Rate', 
      value: `${stats.conversionRate || stats.conversion_rate || 0}%`, 
      icon: TrendingUp, 
      color: 'text-orange-600' 
    },
  ] : defaultStats;

  if (statsLoading) {
    return <PageLoadingSkeleton title="Hiring Dashboard" />;
  }

  if (statsError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Hiring Dashboard</h1>
        </div>
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Failed to load dashboard statistics</p>
              <p className="text-sm text-gray-500 mt-1">Please refresh the page or try again later</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Hiring Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid - Always load first for immediate feedback */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
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

      {/* Lazy loaded sections with enhanced loading */}
      <Suspense fallback={<EnhancedLoading message="Loading quick actions..." />}>
        <LazyQuickActions />
      </Suspense>

      <Suspense fallback={<EnhancedLoading message="Loading recent activity..." />}>
        <LazyRecentActivity />
      </Suspense>
    </div>
  );
};
