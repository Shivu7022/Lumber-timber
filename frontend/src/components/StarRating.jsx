import { Star } from 'lucide-react';

const StarRating = ({ rating = 5, reviews, size = 14, showText = false, className = "text-accent fill-accent" }) => {
  return (
    <div className="flex items-center gap-1">
      {showText && (
        <div className="text-accent font-bold flex items-center gap-1 mr-1">
          {rating}
        </div>
      )}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
           <Star key={i} size={size} className={i < Math.round(rating) ? className : "text-gray-300 fill-gray-300"} />
        ))}
      </div>
      {reviews !== undefined && <span className="text-xs text-textMuted font-medium ml-1">({reviews})</span>}
    </div>
  );
};

export default StarRating;
