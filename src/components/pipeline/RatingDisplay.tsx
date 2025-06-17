
import { Star } from 'lucide-react';

interface RatingDisplayProps {
  rating: number | null;
  size?: 'sm' | 'md' | 'lg';
  showEmpty?: boolean;
}

export const RatingDisplay = ({ rating, size = 'sm', showEmpty = true }: RatingDisplayProps) => {
  if (!rating && !showEmpty) return null;
  
  const starSize = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  }[size];

  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`${starSize} ${
            rating && index < rating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300'
          }`}
        />
      ))}
      {rating && (
        <span className="text-xs text-gray-600 ml-1">
          ({rating}/5)
        </span>
      )}
    </div>
  );
};
