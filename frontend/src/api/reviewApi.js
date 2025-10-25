// frontend/src/api/reviewApi.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

const reviewApi = axios.create({
    baseURL: `${BASE_URL}/api/reviews`,
    headers: {
        'Content-Type': 'application/json',
    },
});

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

export const addReview = async (movieTitle, reviewText, rating) => {
    try {
        const response = await reviewApi.post('/', { movieTitle, reviewText, rating });
        return response.data;
    } catch (error) {
        // Specifically catch 400 for bad request/validation (OMDB or duplicate)
        if (error.response && error.response.status === 400) {
            // Throw ONLY the message string to prevent console stack trace
            throw error.response.data.message;
        }
        // For other unexpected errors, you might still throw the full error object
        // or a generic message if error.response.data.message is not available
        throw error.response?.data?.message || 'Failed to add review due to an unexpected error.';
    }
};

export const getReviews = async (options = {}) => {
    const { rating, sortBy, searchQuery } = options;
    try {
        const response = await reviewApi.get('/', {
            params: { rating, sortBy, searchQuery }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch reviews.';
    }
};

export const getMyReviews = async () => {
    try {
        const response = await reviewApi.get('/my-reviews');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch your reviews.';
    }
};

export const updateReview = async (reviewId, updatedData) => {
    try {
        const { reviewText, rating } = updatedData;
        const response = await reviewApi.put(`/${reviewId}`, { reviewText, rating });
        return response.data;
    } catch (error)
    {
        // Specifically catch 400 for bad request/validation (OMDB or duplicate)
        if (error.response && error.response.status === 400) {
            // Throw ONLY the message string to prevent console stack trace
            throw error.response.data.message;
        }
        throw error.response?.data?.message || 'Failed to update review due to an unexpected error.';
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await reviewApi.delete(`/${reviewId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete review.';
    }
};

export const searchMoviesForForm = async (query) => {
    try {
        const response = await reviewApi.get(`/search-movies`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to search movies.';
    }
};
