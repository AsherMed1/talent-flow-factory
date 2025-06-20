
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Brain } from 'lucide-react';

interface PipelineStatisticsProps {
  statistics: {
    total: number;
    analyzed: number;
    highScoring: number;
    filtered: number;
  };
}

export const PipelineStatistics = ({ statistics }: PipelineStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            Total Candidates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.total}</div>
          <p className="text-xs text-gray-600">All applicants</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            Analyzed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.analyzed}</div>
          <p className="text-xs text-gray-600">Voice analysis complete</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            High Scoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.highScoring}</div>
          <p className="text-xs text-gray-600">8+ overall score</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            Filtered Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{statistics.filtered}</div>
          <p className="text-xs text-gray-600">Match your criteria</p>
        </CardContent>
      </Card>
    </div>
  );
};
