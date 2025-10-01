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
        // Extract a more specific error message from the backend response
        throw error.response?.data?.message || 'Failed to add review.';
    }
};

/**
 * Fetches all movie reviews, with optional filtering and sorting.
 * @param {object} [options] - Options for filtering and sorting.
 * @param {string} [options.rating] - Filter by specific rating (e.g., '5', 'all').
 * @param {string} [options.sortBy] - Sort order (e.g., 'newest', 'highest_rating', 'lowest_rating').
 * @returns {Promise<Array<object>>} An array of reviews.
 * @throws {string} Error message.
 */
export const getReviews = async (options = {}) => {
    const { rating, sortBy } = options;
    try {
        const response = await reviewApi.get('/', {
            params: { rating, sortBy } // These become query parameters like ?rating=5&sortBy=newest
        });
        return response.data;
    } catch (error) {
        // Extract a more specific error message from the backend response
        throw error.response?.data?.message || 'Failed to fetch reviews.';
    }
};
