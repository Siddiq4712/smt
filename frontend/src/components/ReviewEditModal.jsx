// frontend/src/components/ReviewEditModal.jsx
import React, { useState, useEffect } from 'react';

const ReviewEditModal = ({ review, onSave, onClose }) => {
    const [movieTitle, setMovieTitle] = useState(review.movieTitle);
    const [reviewText, setReviewText] = useState(review.reviewText);
    const [rating, setRating] = useState(String(review.rating)); // Convert to string for select

    useEffect(() => {
        // Update form fields if the 'review' prop changes (e.g., editing a different review)
        setMovieTitle(review.movieTitle);
        setReviewText(review.reviewText);
        setRating(String(review.rating));
    }, [review]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(review.id, { movieTitle, reviewText, rating: parseInt(rating) });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
                <h2 className="text-2xl font-bold text-indigo-400 mb-6">Edit Review</h2>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                >
                    &times;
                </button>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="editMovieTitle" className="block text-sm font-medium text-gray-300">
                            Movie Title
                        </label>
                        <input
                            type="text"
                            id="editMovieTitle"
                            value={movieTitle}
                            onChange={(e) => setMovieTitle(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="editRating" className="block text-sm font-medium text-gray-300">
                            Rating (1-5 Stars)
                        </label>
                        <select
                            id="editRating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white"
                            required
                        >
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="editReviewText" className="block text-sm font-medium text-gray-300">
                            Your Review
                        </label>
                        <textarea
                            id="editReviewText"
                            rows="4"
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewEditModal;
