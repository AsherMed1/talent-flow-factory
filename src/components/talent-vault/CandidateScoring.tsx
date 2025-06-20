
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Mic, Star, TrendingUp } from 'lucide-react';
import type { Candidate } from '@/hooks/useCandidates';

interface CandidateScoringProps {
  candidate: Candidate;
}

export const CandidateScoring = ({ candidate }: CandidateScoringProps) => {
  const latestApplication = candidate.applications[0];
  
  // Calculate overall score
  const calculateOverallScore = () => {
    let totalScore = 0;
    let factors = 0;

    // Voice analysis score (40% weight)
    if (latestApplication?.voice_analysis_score) {
      totalScore += (latestApplication.voice_analysis_score / 10) * 40;
      factors++;
    }

    // Pre-screening score (30% weight)
    const preScreening = latestApplication?.pre_screening_responses?.[0];
    if (preScreening?.overall_prescreening_score) {
      totalScore += (preScreening.overall_prescreening_score / 100) * 30;
      factors++;
    }

    // Manual rating (30% weight)
    if (latestApplication?.rating) {
      totalScore += (latestApplication.rating / 5) * 30;
      factors++;
    }

    return factors > 0 ? Math.round(totalScore) : 0;
  };

  const overallScore = calculateOverallScore();
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'Excellent', variant: 'default' as const, color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { text: 'Good', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' };
    if (score > 0) return { text: 'Needs Review', variant: 'outline' as const, color: 'bg-red-100 text-red-800' };
    return { text: 'Not Scored', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' };
  };

  const scoreBadge = getScoreBadge(overallScore);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Candidate Score
          </span>
          <Badge className={scoreBadge.color}>
            {scoreBadge.text}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}/100
          </div>
          <div className="text-xs text-gray-500">Overall Score</div>
          <Progress value={overallScore} className="mt-2 h-2" />
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3 text-sm">
          {/* Voice Analysis */}
          {latestApplication?.voice_analysis_score && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-3 h-3 text-purple-600" />
                <span>Voice Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {latestApplication.voice_analysis_score}/10
                </span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(latestApplication.voice_analysis_score! / 2)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pre-screening */}
          {latestApplication?.pre_screening_responses?.[0] && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3 text-green-600" />
                <span>Pre-screening</span>
              </div>
              <span className="font-medium">
                {latestApplication.pre_screening_responses[0].overall_prescreening_score}/100
              </span>
            </div>
          )}

          {/* Manual Rating */}
          {latestApplication?.rating && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-blue-600" />
                <span>Manual Rating</span>
              </div>
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < latestApplication.rating!
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {overallScore > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs font-medium text-gray-700 mb-1">
              Recommendation
            </div>
            <div className="text-xs text-gray-600">
              {overallScore >= 80 && "Strong candidate - prioritize for interview"}
              {overallScore >= 60 && overallScore < 80 && "Good potential - consider for next round"}
              {overallScore < 60 && overallScore > 0 && "May need additional screening"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
