
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { useState } from 'react';

interface PreScreeningResponse {
  motivation_response: string;
  motivation_score: number;
  experience_response: string;
  experience_score: number;
  availability_response: string;
  availability_score: number;
  communication_score: number;
  overall_prescreening_score: number;
}

interface PreScreeningAnalysisSectionProps {
  responses: PreScreeningResponse[];
}

export const PreScreeningAnalysisSection = ({ responses }: PreScreeningAnalysisSectionProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (!responses || responses.length === 0) {
    return null;
  }

  const response = responses[0]; // Use the first response

  return (
    <div className="border-t pt-3 mt-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">AI Pre-screening Analysis</span>
          <Badge className={`text-xs ${getScoreColor(response.overall_prescreening_score)} border-0`}>
            {response.overall_prescreening_score}/100
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
          className="h-6 px-2"
        >
          {showDetails ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {showDetails && (
        <div className="mt-3 space-y-3">
          {/* Individual Scores Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Motivation:</span>
              <Badge variant="outline" className={getScoreColor(response.motivation_score)}>
                {response.motivation_score}/100
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Experience:</span>
              <Badge variant="outline" className={getScoreColor(response.experience_score)}>
                {response.experience_score}/100
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Availability:</span>
              <Badge variant="outline" className={getScoreColor(response.availability_score)}>
                {response.availability_score}/100
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Communication:</span>
              <Badge variant="outline" className={getScoreColor(response.communication_score)}>
                {response.communication_score}/100
              </Badge>
            </div>
          </div>

          {/* Response Previews */}
          <div className="space-y-2">
            {response.motivation_response && (
              <div className="bg-gray-50 p-2 rounded text-xs">
                <div className="font-medium text-gray-700 mb-1">Motivation:</div>
                <div className="text-gray-600 line-clamp-2">
                  {response.motivation_response.length > 100 
                    ? `${response.motivation_response.substring(0, 100)}...` 
                    : response.motivation_response}
                </div>
              </div>
            )}
            {response.experience_response && (
              <div className="bg-gray-50 p-2 rounded text-xs">
                <div className="font-medium text-gray-700 mb-1">Experience:</div>
                <div className="text-gray-600 line-clamp-2">
                  {response.experience_response.length > 100 
                    ? `${response.experience_response.substring(0, 100)}...` 
                    : response.experience_response}
                </div>
              </div>
            )}
            {response.availability_response && (
              <div className="bg-gray-50 p-2 rounded text-xs">
                <div className="font-medium text-gray-700 mb-1">Availability:</div>
                <div className="text-gray-600 line-clamp-2">
                  {response.availability_response.length > 100 
                    ? `${response.availability_response.substring(0, 100)}...` 
                    : response.availability_response}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
