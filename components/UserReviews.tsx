
import React, { useState, useMemo } from 'react';
import type { UserReview } from '../types';
import { Spinner } from './common/Spinner';

interface UserReviewsProps {
  reviews: UserReview[];
  isLoading: boolean;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.064 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
      </svg>
    ))}
  </div>
);


export const UserReviews: React.FC<UserReviewsProps> = ({ reviews, isLoading }) => {
  const [filter, setFilter] = useState('All');

  const skinTypes = useMemo(() => ['All', ...new Set(reviews.map(r => r.skinType))], [reviews]);
  
  const filteredReviews = useMemo(() => {
    if (filter === 'All') return reviews;
    return reviews.filter(review => review.skinType === filter);
  }, [reviews, filter]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

  if (reviews.length === 0) {
      return <p>No reviews available yet.</p>
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {skinTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 text-xs font-medium rounded-full ${filter === type ? 'bg-brand-green text-white' : 'bg-brand-cream hover:bg-brand-tan'}`}
          >
            {type}
          </button>
        ))}
      </div>
      <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
        {filteredReviews.length > 0 ? filteredReviews.map((review, index) => (
          <div key={index} className="bg-brand-cream p-3 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <div>
                <p className="font-semibold text-sm">{review.username}</p>
                <p className="text-xs text-gray-500">{review.skinType} Skin</p>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        )) : <p>No reviews for this filter.</p>}
      </div>
    </div>
  );
};
