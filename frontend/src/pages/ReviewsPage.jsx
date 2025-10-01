// frontend/src/pages/ReviewsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReviews } from '../api/reviewApi';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import FilterSort from '../components/FilterSort';

const ReviewsPage = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState('');
    const [filterRating, setFilterRating] = useState('all'); // 'all', '1', '2', '3', '4', '5'
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'highest_rating', 'lowest_rating'

    // Memoized function to fetch reviews based on current filter/sort state
    const fetchAllReviews = useCallback(async () => {
        setLoadingReviews(true);
        setReviewsError('');
        try {
            const fetchedReviews = await getReviews({ rating: filterRating, sortBy });
            setReviews(fetchedReviews);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            // Check if error is due to token expiration/invalid, then force logout
            if (err.includes('token failed') || err.includes('no token')) {
                // You might want to implement a more robust auto-logout in AuthContext or an axios interceptor
                setReviewsError("Your session has expired. Please log in again.");
                // logout(); // Uncomment this if you want to force logout on review fetch auth error
            } else {
                setReviewsError(err);
            }
        } finally {
            setLoadingReviews(false);
        }
    }, [filterRating, sortBy]); // Dependencies for useCallback

    useEffect(() => {
        // Fetch reviews when component mounts or when filter/sort options change
        // Only proceed if authentication state has been determined
        if (!authLoading && isAuthenticated) {
            fetchAllReviews();
        } else if (!authLoading && !isAuthenticated) {
            // If not authenticated, clear reviews and stop loading
            setReviews([]);
            setLoadingReviews(false);
        }
    }, [authLoading, isAuthenticated, fetchAllReviews]); // Re-run when auth status or fetch function changes

    // Callback to re-fetch reviews after a new review is successfully added
    const handleReviewAdded = () => {
        fetchAllReviews();
    };

    if (authLoading) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-gray-900 flex justify-center items-center text-white text-xl">
                Loading user authentication...
            </div>
        );
    }

    if (!isAuthenticated) {
        // This should ideally be caught by the <ProtectedRoute>, but for robustness:
        return (
            <div className="min-h-[calc(100vh-64px)] bg-gray-900 flex justify-center items-center text-white text-xl">
                Please log in to view and submit reviews.
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white py-8 px-4">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400">Movie Reviews</h1>
                <p className="text-xl text-center mb-12 text-gray-300">
                    Hello, {user?.username}! Explore and share your movie reviews.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Review Form Section (takes 1/3 width on medium screens and up) */}
                    <div className="md:col-span-1">
                        <ReviewForm onReviewAdded={handleReviewAdded} />
                    </div>

                    {/* Review List Section (takes 2/3 width on medium screens and up) */}
                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold mb-6 text-indigo-400 text-center md:text-left">Community Reviews</h2>
                        <FilterSort
                            filterRating={filterRating}
                            sortBy={sortBy}
                            onFilterChange={setFilterRating}
                            onSortChange={setSortBy}
                        />
                        <ReviewList reviews={reviews} loading={loadingReviews} error={reviewsError} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;
