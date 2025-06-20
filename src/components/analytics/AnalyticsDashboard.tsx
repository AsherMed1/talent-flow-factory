
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  Target, 
  Brain,
  Calendar,
  Award,
  MessageCircle
} from 'lucide-react';
import { useApplications } from '@/hooks/useApplications';
import { useCandidates } from '@/hooks/useCandidates';

export const AnalyticsDashboard = () => {
  const { data: applications } = useApplications();
  const { data: candidates } = useCandidates();

  // Calculate metrics
  const totalCandidates = candidates?.length || 0;
  const totalApplications = applications?.length || 0;
  
  const conversionRate = totalCandidates > 0 
    ? Math.round((applications?.filter(app => app.status === 'hired').length || 0) / totalCandidates * 100)
    : 0;

  const avgVoiceScore = applications?.length > 0
    ? Math.round(
        applications
          .filter(app => app.voice_analysis_score)
          .reduce((sum, app) => sum + (app.voice_analysis_score || 0), 0) / 
        applications.filter(app => app.voice_analysis_score).length
      )
    : 0;

  const interviewsThisWeek = applications?.filter(app => {
    if (!app.interview_date) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(app.interview_date) >= weekAgo;
  }).length || 0;

  const topPerformingCandidates = applications
    ?.filter(app => app.voice_analysis_score && app.voice_analysis_score >= 8)
    .length || 0;

  const avgTimeToHire = applications?.filter(app => app.status === 'hired').length > 0
    ? Math.round(
        applications
          .filter(app => app.status === 'hired')
          .reduce((sum, app) => {
            const applied = new Date(app.applied_date);
            const hired = new Date(app.updated_at);
            return sum + (hired.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24);
          }, 0) / applications.filter(app => app.status === 'hired').length
      )
    : 0;

  const metricsData = [
    {
      title: 'Total Candidates',
      value: totalCandidates.toString(),
      change: '+12% from last month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '+5% from last month',
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Avg Voice Score',
      value: `${avgVoiceScore}/10`,
      change: 'Quality improving',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Interviews This Week',
      value: interviewsThisWeek.toString(),
      change: 'Steady pipeline',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Top Performers',
      value: topPerformingCandidates.toString(),
      change: 'High-quality candidates',
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Avg Time to Hire',
      value: `${avgTimeToHire} days`,
      change: 'Efficient process',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.value}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {metric.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${metric.bgColor}`}>
                    <Icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pipeline Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Pipeline Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {['applied', 'reviewed', 'interview_scheduled', 'hired'].map((stage, index) => {
              const stageCount = applications?.filter(app => app.status === stage).length || 0;
              const percentage = totalApplications > 0 ? Math.round((stageCount / totalApplications) * 100) : 0;
              
              return (
                <div key={stage} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stageCount}</div>
                  <div className="text-sm text-gray-500 capitalize">
                    {stage.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-blue-600">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
