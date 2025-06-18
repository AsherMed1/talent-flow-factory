
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';

interface InterviewStatusSectionProps {
  rating: number;
  interviewStatus: string;
  onRatingChange: (rating: number) => void;
  onStatusChange: (status: string) => void;
}

export const InterviewStatusSection = ({
  rating,
  interviewStatus,
  onRatingChange,
  onStatusChange
}: InterviewStatusSectionProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 cursor-pointer ${
              index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
            onClick={() => onRatingChange(index + 1)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Overall Rating</Label>
        <div className="mt-2">
          {renderStars(rating)}
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Interview Status</Label>
        <RadioGroup
          value={interviewStatus}
          onValueChange={onStatusChange}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="interview_completed" id="potential" />
            <Label htmlFor="potential">Interview Complete - Ready for disposition</Label>
          </div>
        </RadioGroup>
        <p className="text-sm text-gray-500 mt-2">
          This will open the disposition dialog to make the final hiring decision.
        </p>
      </div>
    </div>
  );
};
