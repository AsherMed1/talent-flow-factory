
import { Badge } from '@/components/ui/badge';
import { Brain, MessageCircle, Star, TrendingUp } from 'lucide-react';
import { PreScreeningResponse } from '@/hooks/useApplications';

interface PreScreeningAnalysisSectionProps {
  responses: PreScreeningResponse[];
}

export const PreScreeningAnalysisSection = ({ responses }: PreScreeningAnalysisSectionProps) => {
  if (!responses || responses.length === 0) return null;

  const latestResponse = responses[0];
  const hasScores = latestResponse.overall_prescreening_score !== null;

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600 border-gray-200';
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const renderScoreStars = (score: number | null) => {
    if (!score) return null;
    
    const starCount = Math.ceil(score / 20); // Convert 100-point scale to 5-star
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`w-3 h-3 ${
              index < starCount ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-purple-600" />
        <span className="text-sm font-medium text-purple-600">Pre-screening Analysis</span>
        {hasScores && (
          <Badge className={`text-xs ${getScoreBadgeColor(latestResponse.overall_prescreening_score)}`}>
            {latestResponse.overall_prescreening_score}/100
          </Badge>
        )}
      </div>

      {hasScores ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Motivation Score */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-orange-500" />
              <span className="text-gray-600">Motivation</span>
            </div>
            <div className="flex items-center gap-2">
              {renderScoreStars(latestResponse.motivation_score)}
              <span className={`font-medium ${getScoreColor(latestResponse.motivation_score)}`}>
                {latestResponse.motivation_score}/100
              </span>
            </div>
          </div>

          {/* Experience Score */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-blue-500" />
              <span className="text-gray-600">Experience</span>
            </div>
            <div className="flex items-center gap-2">
              {renderScoreStars(latestResponse.experience_score)}
              <span className={`font-medium ${getScoreColor(latestResponse.experience_score)}`}>
                {latestResponse.experience_score}/100
              </span>
            </div>
          </div>

          {/* Availability Score */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3 text-green-500" />
              <span className="text-gray-600">Availability</span>
            </div>
            <div className="flex items-center gap-2">
              {renderScoreStars(latestResponse.availability_score)}
              <span className={`font-medium ${getScoreColor(latestResponse.availability_score)}`}>
                {latestResponse.availability_score}/100
              </span>
            </div>
          </div>

          {/* Communication Score */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Brain className="w-3 h-3 text-purple-500" />
              <span className="text-gray-600">Communication</span>
            </div>
            <div className="flex items-center gap-2">
              {renderScoreStars(latestResponse.communication_score)}
              <span className={`font-medium ${getScoreColor(latestResponse.communication_score)}`}>
                {latestResponse.communication_score}/100
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MessageCircle className="w-3 h-3" />
          <span>Pre-screening responses submitted • Analysis pending</span>
        </div>
      )}

      {/* Show analysis timestamp */}
      {latestResponse.scored_at && (
        <div className="mt-2 text-xs text-gray-400">
          Analyzed: {new Date(latestResponse.scored_at).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};
