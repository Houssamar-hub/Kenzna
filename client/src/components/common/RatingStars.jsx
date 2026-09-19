import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, reviewsCount, size = 'sm', showCount = true }) => {
  const iconSize = size === 'lg' ? 20 : size === 'md' ? 16 : 14;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={iconSize}
            className={`${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-stone-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-stone-700">{Number(rating).toFixed(1)}</span>
      {showCount && reviewsCount !== undefined && (
        <span className="text-xs text-stone-400">({reviewsCount})</span>
      )}
    </div>
  );
};

export default RatingStars;
