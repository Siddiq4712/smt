// frontend/src/pages/ReviewsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReviews, updateReview, deleteReview } from '../api/reviewApi';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import FilterSortSearch from '../components/FilterSortSearch';
import ReviewEditModal from '../components/ReviewEditModal';

const ReviewsPage = () => {
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewsError, setReviewsError] = useState('');
    const [filterRating, setFilterRating] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchQuery, setSearchQuery] = useState('');

    const [editingReview, setEditingReview] = useState(null);

    const fetchAllReviews = useCallback(async () => {
        setLoadingReviews(true);
        setReviewsError('');
        try {
            const fetchedReviews = await getReviews({
                rating: filterRating,
                sortBy,
                searchQuery
            });
            setReviews(fetchedReviews);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
            const errorMessage = err.toString().includes('401') ? "Your session has expired. Please log in again." : err;
            setReviewsError(errorMessage);
            if (err.toString().includes('401')) {
                logout();
            }
        } finally {
            setLoadingReviews(false);
        }
    }, [filterRating, sortBy, searchQuery, logout]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchAllReviews();
        } else if (!authLoading && !isAuthenticated) {
            setReviews([]);
            setLoadingReviews(false);
        }
    }, [authLoading, isAuthenticated, fetchAllReviews]);

    const handleReviewAdded = () => {
        fetchAllReviews();
    };

    const handleEditClick = (review) => {
        setEditingReview(review);
    };

    const handleSaveEdit = async (reviewId, updatedData) => {
        // No local state for error here, modal handles it
        try {
            const updatedReview = await updateReview(reviewId, updatedData);
            setReviews(reviews.map(rev => rev.id === reviewId ? updatedReview : rev));
            setEditingReview(null); // Close modal on success
            return true; // Indicate success
        } catch (err) {
            console.error("Error updating review:", err);
            // Propagate the error back to the modal for display
            throw err;
        }
    };


    const handleDeleteClick = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }
        setReviewsError('');
        try {
            await deleteReview(reviewId);
            setReviews(reviews.filter(rev => rev.id !== reviewId));
        } catch (err) {
            console.error("Error deleting review:", err);
            setReviewsError(err);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-gray-900 flex justify-center items-center text-white text-xl">
                Loading user authentication...
            </div>
        );
    }

    if (!isAuthenticated) {
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
                    <div className="md:col-span-1">
                        <ReviewForm onReviewAdded={handleReviewAdded} />
                    </div>

                    <div className="md:col-span-2">
                        <h2 className="text-3xl font-bold mb-6 text-indigo-400 text-center md:text-left">Community Reviews</h2>
                        <FilterSortSearch
                            filterRating={filterRating}
                            sortBy={sortBy}
                            searchQuery={searchQuery}
                            onFilterChange={setFilterRating}
                            onSortChange={setSortBy}
                            onSearchChange={setSearchQuery}
                        />
                        <ReviewList
                            reviews={reviews}
                            loading={loadingReviews}
                            error={reviewsError}
                            currentUserId={user?.id}
                            onEdit={handleEditClick}
                            onDelete={handleDeleteClick}
                        />
                    </div>
                </div>
            </div>
            {editingReview && (
                <ReviewEditModal
                    review={editingReview}
                    onSave={handleSaveEdit}
                    onClose={() => setEditingReview(null)}
                />
            )}
        </div>
    );
};

export default ReviewsPage;
