// backend/utils/omdbApi.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Ensure dotenv is run here to load the API key when this file is imported

const OMDB_API_KEY = process.env.OMDB_API_KEY;

// Log the key (temporarily for debugging) to ensure it's loaded
if (!OMDB_API_KEY) {
    console.error('CRITICAL ERROR: OMDB_API_KEY is not defined. Check your backend/.env file.');
} else {
    // console.log('OMDB_API_KEY successfully loaded:', OMDB_API_KEY.substring(0, 4) + '...'); // Log first few chars
}

// Ensure the base URL correctly includes the API key
const OMDB_BASE_URL = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;


/**
 * Searches for movies by title for autocomplete suggestions.
 * @param {string} query The search query.
 * @returns {Array} An array of movie suggestions (imdbID, Title, Year, Poster).
 */
export const searchOmdbMovies = async (query) => {
    if (!query || query.length < 3) return []; // Require at least 3 characters for search
    if (!OMDB_API_KEY) { // Re-check if key is missing, although it should be caught above
        console.error('OMDB_API_KEY is missing, cannot search OMDB.');
        return [];
    }
    try {
        const response = await axios.get(`${OMDB_BASE_URL}&s=${encodeURIComponent(query)}&type=movie`); // type=movie to filter
        if (response.data.Response === 'True') {
            return response.data.Search.map(movie => ({
                imdbID: movie.imdbID,
                Title: movie.Title,
                Year: movie.Year,
                Poster: movie.Poster === 'N/A' ? null : movie.Poster
            }));
        } else {
            console.warn(`OMDB search for "${query}" responded with:`, response.data.Error);
            return [];
        }
    } catch (error) {
        console.error('Error searching OMDB movies:', error.message);
        // Log the full response data if available for more insights
        if (error.response) {
            console.error('OMDB API Response Data:', error.response.data);
            console.error('OMDB API Response Status:', error.response.status);
            console.error('OMDB API Response Headers:', error.response.headers);
        }
        return [];
    }
};

/**
 * Gets detailed information for a specific movie by exact title or IMDb ID.
 * This is used for final validation or to get the precise title.
 * @param {string} identifier The movie title or IMDb ID.
 * @param {boolean} isImdbId True if identifier is an IMDb ID, false if a title.
 * @returns {object|null} The movie details (imdbID, Title, Year, Plot, Poster) or null if not found.
 */
export const getOmdbMovie = async (identifier, isImdbId = false) => {
    if (!identifier) return null;
    if (!OMDB_API_KEY) { // Re-check if key is missing
        console.error('OMDB_API_KEY is missing, cannot get OMDB movie details.');
        return null;
    }
    try {
        const param = isImdbId ? `i=${encodeURIComponent(identifier)}` : `t=${encodeURIComponent(identifier)}`;
        const response = await axios.get(`${OMDB_BASE_URL}&${param}&plot=short&type=movie`); // plot=short for some detail, type=movie
        if (response.data.Response === 'True') {
            return {
                imdbID: response.data.imdbID,
                Title: response.data.Title,
                Year: response.data.Year,
                Plot: response.data.Plot,
                Poster: response.data.Poster === 'N/A' ? null : response.data.Poster,
            };
        } else {
            console.warn(`OMDB get details for "${identifier}" responded with:`, response.data.Error);
            return null;
        }
    } catch (error) {
        console.error('Error getting OMDB movie details:', error.message);
         if (error.response) {
            console.error('OMDB API Response Data:', error.response.data);
            console.error('OMDB API Response Status:', error.response.status);
            console.error('OMDB API Response Headers:', error.response.headers);
        }
        return null;
    }
};
