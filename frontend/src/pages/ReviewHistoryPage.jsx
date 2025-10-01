// frontend/src/pages/ReviewHistoryPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyReviews, updateReview, deleteReview } from '../api/reviewApi';
import ReviewList from '../components/ReviewList';
import ReviewEditModal from '../components/ReviewEditModal';

const ReviewHistoryPage = () => {
    const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
    const [myReviews, setMyReviews] = useState([]);
    const [loadingMyReviews, setLoadingMyReviews] = useState(true);
    const [myReviewsError, setMyReviewsError] = useState('');

    const [editingReview, setEditingReview] = useState(null); // State for review editing

    const fetchMyReviewHistory = useCallback(async () => {
        setLoadingMyReviews(true);
        setMyReviewsError('');
        try {
            const fetchedReviews = await getMyReviews();
            setMyReviews(fetchedReviews);
        } catch (err) {
            console.error("Failed to fetch user's reviews:", err);
            const errorMessage = err.toString().includes('401') ? "Your session has expired. Please log in again." : err;
            setMyReviewsError(errorMessage);
            if (err.toString().includes('401')) {
                logout(); // Force logout on auth error
            }
        } finally {
            setLoadingMyReviews(false);
        }
    }, [logout]);

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            fetchMyReviewHistory();
        } else if (!authLoading && !isAuthenticated) {
            setMyReviews([]);
            setLoadingMyReviews(false);
        }
    }, [authLoading, isAuthenticated, fetchMyReviewHistory]);

    const handleEditClick = (review) => {
        setEditingReview(review); // Set the review to be edited
    };

    const handleSaveEdit = async (reviewId, updatedData) => {
        setMyReviewsError('');
        try {
            const updatedReview = await updateReview(reviewId, updatedData);
            setMyReviews(myReviews.map(rev => rev.id === reviewId ? updatedReview : rev));
            setEditingReview(null); // Close modal
        } catch (err) {
            console.error("Error updating review:", err);
            setMyReviewsError(err);
        }
    };

    const handleDeleteClick = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }
        setMyReviewsError('');
        try {
            await deleteReview(reviewId);
            setMyReviews(myReviews.filter(rev => rev.id !== reviewId));
        } catch (err) {
            console.error("Error deleting review:", err);
            setMyReviewsError(err);
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
                Please log in to view your review history.
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white py-8 px-4">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400">Your Review History</h1>
                <p className="text-xl text-center mb-12 text-gray-300">
                    Hello, {user?.username}! Here are all the reviews you've submitted.
                </p>

                <div className="max-w-3xl mx-auto">
                    <ReviewList
                        reviews={myReviews}
                        loading={loadingMyReviews}
                        error={myReviewsError}
                        currentUserId={user?.id} // Pass current user ID
                        onEdit={handleEditClick}
                        onDelete={handleDeleteClick}
                    />
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

export default ReviewHistoryPage;
