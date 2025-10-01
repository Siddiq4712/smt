// frontend/src/components/ReviewList.jsx
import React from 'react';

const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <svg
                key={i}
                className={`w-5 h-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-500'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
            </svg>
        );
    }
    return <div className="flex">{stars}</div>;
};

const ReviewList = ({ reviews, loading, error, currentUserId, onEdit, onDelete }) => {
    if (loading) {
        return <p className="text-center text-gray-400">Loading reviews...</p>;
    }

    if (error) {
        return <p className="text-center text-red-400">Error fetching reviews: {error}</p>;
    }

    if (!reviews || reviews.length === 0) {
        return <p className="text-center text-gray-400">No reviews found. Be the first to add one!</p>;
    }

    return (
        <div className="space-y-4">
            {reviews.map((review) => (
                <div key={review.id} className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-white">{review.movieTitle}</h3>
                        <StarRating rating={review.rating} />
                    </div>
                    <p className="text-gray-300 text-sm mb-3">
                        Reviewed by <span className="font-medium text-indigo-300">{review.User?.username || 'Anonymous'}</span> on{' '}
                        {new Date(review.createdAt).toLocaleDateString()}{' '}
                        {/* Optionally add time */}
                        <span className="text-gray-400 text-xs">({new Date(review.createdAt).toLocaleTimeString()})</span>
                    </p>
                    <p className="text-gray-200 leading-relaxed mb-4">{review.reviewText}</p>

                    {/* Edit/Delete buttons (only for owner) */}
                    {currentUserId && review.User?.id === currentUserId && (
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => onEdit(review)}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-md transition-colors"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(review.id)}
                                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
