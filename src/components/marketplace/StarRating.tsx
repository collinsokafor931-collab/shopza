import React from 'react';
import { Star } from 'lucide-react';

export const StarRating: React.FC<{
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumeric?: boolean;
}> = ({ rating, count, size = 'sm', showNumeric = true }) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>
      {showNumeric && (
        <span className={`${textSize} font-semibold text-slate-200 font-mono-nums`}>
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className={`${textSize} text-slate-400`}>({count})</span>
      )}
    </div>
  );
};
