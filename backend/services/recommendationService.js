// backend/services/recommendationService.js
import { generateTextWithOllama } from '../utils/ollamaClient.js';

/**
 * Recommends movies based on a given movie title using Ollama/Mistral.
 * @param {string} movieTitle The movie title to base recommendations on.
 * @returns {Promise<string>} A natural language string of recommendations.
 */
export const getMovieRecommendations = async (movieTitle) => {
    if (!movieTitle) {
        throw new Error('Movie title is required for recommendations.');
    }

    const prompt = `You are a movie recommendation AI. Recommend 5-7 movies similar to "${movieTitle}". Briefly mention why each is similar. Format your recommendations as a list.`;

    try {
        const recommendations = await generateTextWithOllama(prompt);
        return recommendations;
    } catch (error) {
        console.error('Error generating movie recommendations:', error);
        throw new Error('Could not generate recommendations at this time.');
    }
};
