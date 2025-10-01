// frontend/src/components/ReviewForm.jsx
import React, { useState } from 'react';
import { addReview } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';

const ReviewForm = ({ onReviewAdded }) => {
    const [movieTitle, setMovieTitle] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('5');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { isAuthenticated } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!isAuthenticated) {
            setError('You must be logged in to submit a review.');
            return;
        }
        if (!movieTitle.trim() || !reviewText.trim() || !rating) {
            setError('All fields are required.');
            return;
        }

        setIsLoading(true);
        try {
            await addReview(movieTitle, reviewText, parseInt(rating));
            setSuccessMessage('Review added successfully!');
            setMovieTitle('');
            setReviewText('');
            setRating('5');
            if (onReviewAdded) {
                onReviewAdded(); // Re-fetch reviews for the main list
            }
        } catch (err) {
            console.error("Error adding review:", err);
            setError(err); // Display error message from the API, including duplicate message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Submit a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="movieTitle" className="block text-sm font-medium text-gray-300">
                        Movie Title
                    </label>
                    <input
                        type="text"
                        id="movieTitle"
                        value={movieTitle}
                        onChange={(e) => setMovieTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="e.g., The Matrix"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-300">
                        Rating (1-5 Stars)
                    </label>
                    <select
                        id="rating"
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
                    <label htmlFor="reviewText" className="block text-sm font-medium text-gray-300">
                        Your Review
                    </label>
                    <textarea
                        id="reviewText"
                        rows="4"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Share your thoughts on the movie..."
                        required
                    ></textarea>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

                <button
                    type="submit"
                    disabled={isLoading || !isAuthenticated}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
