// frontend/src/api/reviewApi.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

const reviewApi = axios.create({
    baseURL: `${BASE_URL}/api/reviews`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach token to all outgoing requests
reviewApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Submits a new movie review.
 * @param {string} movieTitle
 * @param {string} reviewText
 * @param {number} rating (1-5)
 * @returns {Promise<object>} The created review.
 * @throws {string} Error message.
 */
export const addReview = async (movieTitle, reviewText, rating) => {
    try {
        const response = await reviewApi.post('/', { movieTitle, reviewText, rating });
        return response.data;
    } catch (error) {
        // Specifically catch 409 for existing review
        if (error.response && error.response.status === 409) {
            throw error.response.data.message; // Use the specific message from backend
        }
        throw error.response?.data?.message || 'Failed to add review.';
    }
};

/**
 * Fetches all movie reviews, with optional filtering, sorting, and searching.
 * @param {object} [options] - Options for filtering and sorting.
 * @param {string} [options.rating] - Filter by specific rating (e.g., '5', 'all').
 * @param {string} [options.sortBy] - Sort order (e.g., 'newest', 'highest_rating', 'lowest_rating').
 * @param {string} [options.searchQuery] - Search by movie title.
 * @returns {Promise<Array<object>>} An array of reviews.
 * @throws {string} Error message.
 */
export const getReviews = async (options = {}) => {
    const { rating, sortBy, searchQuery } = options;
    try {
        const response = await reviewApi.get('/', {
            params: { rating, sortBy, searchQuery } // <-- Pass searchQuery here
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch reviews.';
    }
};

/**
 * Fetches reviews made by the currently logged-in user.
 * @returns {Promise<Array<object>>} An array of reviews by the current user.
 * @throws {string} Error message.
 */
export const getMyReviews = async () => {
    try {
        const response = await reviewApi.get('/my-reviews');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch your reviews.';
    }
};

/**
 * Updates an existing review.
 * @param {string} reviewId - The ID of the review to update.
 * @param {object} updatedData - Object containing movieTitle, reviewText, rating.
 * @returns {Promise<object>} The updated review.
 * @throws {string} Error message.
 */
export const updateReview = async (reviewId, updatedData) => {
    try {
        const response = await reviewApi.put(`/${reviewId}`, updatedData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to update review.';
    }
};

/**
 * Deletes a review.
 * @param {string} reviewId - The ID of the review to delete.
 * @returns {Promise<object>} A success message.
 * @throws {string} Error message.
 */
export const deleteReview = async (reviewId) => {
    try {
        const response = await reviewApi.delete(`/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete review.';
    }
};
