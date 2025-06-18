
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface RecruiterSummaryCardProps {
  recruiterSummary: {
    overallAssessment: string;
    strengths: string[];
    concerns: string[];
    hiringRecommendation: 'strong_hire' | 'hire' | 'no_hire' | 'more_data_needed';
    confidenceLevel: number;
  };
}

export const RecruiterSummaryCard = ({ recruiterSummary }: RecruiterSummaryCardProps) => {
  // Add null check to prevent runtime errors
  if (!recruiterSummary) {
    return null;
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_hire': return 'bg-green-100 text-green-800';
      case 'hire': return 'bg-blue-100 text-blue-800';
      case 'no_hire': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getRecommendationLabel = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_hire': return 'Strong Hire';
      case 'hire': return 'Hire';
      case 'no_hire': return 'No Hire';
      default: return 'More Data Needed';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-purple-600" />
            Expert Recruiter Assessment
          </div>
          <Badge className={getRecommendationColor(recruiterSummary.hiringRecommendation)}>
            {getRecommendationLabel(recruiterSummary.hiringRecommendation)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-2">Overall Assessment</h4>
          <p className="text-sm text-gray-700 leading-relaxed">
            {recruiterSummary.overallAssessment}
          </p>
        </div>

        {recruiterSummary.strengths && recruiterSummary.strengths.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-700">
              <TrendingUp className="w-4 h-4" />
              Key Strengths
            </h4>
            <ul className="space-y-1">
              {recruiterSummary.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recruiterSummary.concerns && recruiterSummary.concerns.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-orange-600">
              <AlertTriangle className="w-4 h-4" />
              Areas of Concern
            </h4>
            <ul className="space-y-1">
              {recruiterSummary.concerns.map((concern, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Recruiter Confidence Level:</span>
            <span className="text-purple-700 font-semibold">{recruiterSummary.confidenceLevel}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
