// backend/controllers/recommendationController.js
import { getMovieRecommendations } from '../services/recommendationService.js';

/**
 * Controller to handle movie recommendation requests.
 */
export const recommendMovies = async (req, res) => {
    try {
        const { movieTitle } = req.query; // Expect movieTitle as a query parameter
        if (!movieTitle) {
            return res.status(400).json({ message: 'Movie title query parameter is required.' });
        }

        const recommendations = await getMovieRecommendations(movieTitle);
        res.status(200).json({ success: true, recommendations });
    } catch (error) {
        console.error('Error in recommendMovies controller:', error);
        res.status(500).json({ success: false, message: error.message || 'Failed to get recommendations.' });
    }
};
