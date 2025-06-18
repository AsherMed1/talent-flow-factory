
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
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

interface PreScreeningAnalysisProps {
  responses: PreScreeningResponse[];
}

export const PreScreeningAnalysis = ({ responses }: PreScreeningAnalysisProps) => {
  const [showScreeningDetails, setShowScreeningDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (!responses || responses.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-3">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 p-0 h-auto font-medium text-gray-700"
        onClick={() => setShowScreeningDetails(!showScreeningDetails)}
      >
        Pre-screening Analysis
        {showScreeningDetails ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
      
      {showScreeningDetails && (
        <div className="mt-3 space-y-3">
          {responses.map((response, index) => (
            <div key={index} className="space-y-3">
              {/* Overall Score */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Score:</span>
                <Badge className={`${getScoreColor(response.overall_prescreening_score)} border-0`}>
                  {response.overall_prescreening_score}/100
                </Badge>
              </div>

              {/* Individual Scores */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Motivation:</span>
                  <span className={`px-2 py-1 rounded ${getScoreColor(response.motivation_score)}`}>
                    {response.motivation_score}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className={`px-2 py-1 rounded ${getScoreColor(response.experience_score)}`}>
                    {response.experience_score}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className={`px-2 py-1 rounded ${getScoreColor(response.availability_score)}`}>
                    {response.availability_score}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Communication:</span>
                  <span className={`px-2 py-1 rounded ${getScoreColor(response.communication_score)}`}>
                    {response.communication_score}
                  </span>
                </div>
              </div>

              {/* Responses */}
              <div className="space-y-2">
                {response.motivation_response && (
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <div className="font-medium text-gray-700 mb-1">Motivation:</div>
                    <div className="text-gray-600">{response.motivation_response}</div>
                  </div>
                )}
                {response.experience_response && (
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <div className="font-medium text-gray-700 mb-1">Experience:</div>
                    <div className="text-gray-600">{response.experience_response}</div>
                  </div>
                )}
                {response.availability_response && (
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <div className="font-medium text-gray-700 mb-1">Availability:</div>
                    <div className="text-gray-600">{response.availability_response}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
