// frontend/src/api/recommendationApi.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

const recommendationApi = axios.create({
    baseURL: `${BASE_URL}/api/recommendations`,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Fetches movie recommendations from the backend.
 * @param {string} movieTitle The movie title to get recommendations for.
 * @returns {Promise<string>} A string containing the movie recommendations.
 * @throws {string} Error message if fetching fails.
 */
export const getRecommendations = async (movieTitle) => {
    try {
        const response = await recommendationApi.get('/', {
            params: { movieTitle }
        });
        if (response.data.success === false) {
            throw response.data.message;
        }
        return response.data.recommendations;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to get recommendations.';
    }
};
