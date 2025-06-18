
import { Star } from 'lucide-react';

interface CandidateRatingProps {
  rating: number | null;
  appliedDate?: string;
}

export const CandidateRating = ({ rating, appliedDate }: CandidateRatingProps) => {
  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }, (_, index) => (
          <Star key={index} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {halfStar && <Star className="w-4 h-4 fill-yellow-200 text-yellow-400" />}
        <span className="text-sm text-gray-600 ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between">
      {rating && renderStars(rating)}
      {appliedDate && (
        <div className="text-sm text-gray-500">
          Applied: {new Date(appliedDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};
