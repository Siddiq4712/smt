// frontend/src/components/ReviewForm.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { addReview, searchMoviesForForm } from '../api/reviewApi';
import { useAuth } from '../context/AuthContext';

// Import a placeholder image if you have one, e.g., 'no-poster.png' in your public folder
// const NO_POSTER_IMAGE = '/no-poster.png'; // Example

const ReviewForm = ({ onReviewAdded }) => {
    const [movieTitleInput, setMovieTitleInput] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('5');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [movieSuggestions, setMovieSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedMovieOmdbTitle, setSelectedMovieOmdbTitle] = useState('');
    const [isValidMovieSelected, setIsValidMovieSelected] = useState(false);
    const searchTimeoutRef = useRef(null);
    const suggestionsRef = useRef(null);

    const { isAuthenticated } = useAuth();

    const debounceSearch = useCallback((query) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        if (query.length < 3) {
            setMovieSuggestions([]);
            setShowSuggestions(false);
            setSearchLoading(false);
            setIsValidMovieSelected(false);
            setSelectedMovieOmdbTitle('');
            return;
        }

        setSearchLoading(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const results = await searchMoviesForForm(query);
                setMovieSuggestions(results);
                setShowSuggestions(true);
                const exactMatch = results.find(
                    sug => sug.Title.toLowerCase() === query.toLowerCase()
                );
                if (exactMatch) {
                    setSelectedMovieOmdbTitle(exactMatch.Title);
                    setIsValidMovieSelected(true);
                } else {
                    setIsValidMovieSelected(false);
                    setSelectedMovieOmdbTitle('');
                }
            } catch (err) {
                console.error("OMDB search error:", err);
                setMovieSuggestions([]);
                setIsValidMovieSelected(false);
                setSelectedMovieOmdbTitle('');
            } finally {
                setSearchLoading(false);
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (movieTitleInput) {
            debounceSearch(movieTitleInput);
        } else {
            setMovieSuggestions([]);
            setShowSuggestions(false);
            setSearchLoading(false);
            setIsValidMovieSelected(false);
            setSelectedMovieOmdbTitle('');
        }
    }, [movieTitleInput, debounceSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMovieTitleInputChange = (e) => {
        const value = e.target.value;
        setMovieTitleInput(value);
        setIsValidMovieSelected(false);
        setSelectedMovieOmdbTitle('');
        setError('');
        setSuccessMessage('');
    };

    const selectMovie = (movie) => {
        setMovieTitleInput(movie.Title);
        setSelectedMovieOmdbTitle(movie.Title);
        setIsValidMovieSelected(true);
        setShowSuggestions(false);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
            if (movieTitleInput && !isValidMovieSelected && movieSuggestions.length > 0) {
                const exactMatch = movieSuggestions.find(
                    sug => sug.Title.toLowerCase() === movieTitleInput.toLowerCase()
                );
                if (exactMatch) {
                    setSelectedMovieOmdbTitle(exactMatch.Title);
                    setIsValidMovieSelected(true);
                    setError('');
                } else {
                    setIsValidMovieSelected(false);
                    setSelectedMovieOmdbTitle('');
                }
            } else if (!movieTitleInput) {
                setIsValidMovieSelected(false);
                setSelectedMovieOmdbTitle('');
            }
        }, 100);
    };

    const handleInputFocus = () => {
        if (movieSuggestions.length > 0 && movieTitleInput.length >= 3) {
            setShowSuggestions(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!isAuthenticated) {
            setError('You must be logged in to submit a review.');
            return;
        }
        if (!selectedMovieOmdbTitle || !isValidMovieSelected || !reviewText.trim() || !rating) {
            setError('Please select a valid movie, fill in review text and rating.');
            return;
        }

        setIsLoading(true);
        try {
            await addReview(selectedMovieOmdbTitle, reviewText, parseInt(rating));
            setSuccessMessage('Review added successfully!');
            setMovieTitleInput('');
            setSelectedMovieOmdbTitle('');
            setIsValidMovieSelected(false);
            setReviewText('');
            setRating('5');
            if (onReviewAdded) {
                onReviewAdded();
            }
        } catch (err) {
            console.error("Error adding review:", err);
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Submit a Review</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative" ref={suggestionsRef}>
                    <label htmlFor="movieTitle" className="block text-sm font-medium text-gray-300">
                        Movie Title
                    </label>
                    <input
                        type="text"
                        id="movieTitle"
                        value={movieTitleInput}
                        onChange={handleMovieTitleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        className={`mt-1 block w-full px-3 py-2 bg-gray-700 border rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                            ${movieTitleInput && isValidMovieSelected ? 'border-green-500' : (movieTitleInput && !isValidMovieSelected && movieTitleInput.length >= 3 && !searchLoading ? 'border-red-500' : 'border-gray-600')}
                        `}
                        placeholder="Type movie title (e.g., The Matrix)"
                        required
                    />
                    {searchLoading && movieTitleInput.length >= 3 && <p className="text-sm text-indigo-400 mt-1">Searching...</p>}
                    {movieTitleInput && isValidMovieSelected && !searchLoading && <p className="text-sm text-green-400 mt-1">Movie title validated!</p>}
                    {movieTitleInput && !isValidMovieSelected && movieTitleInput.length >= 3 && !searchLoading && movieSuggestions.length === 0 && <p className="text-sm text-red-400 mt-1">No movies found. Please try another title.</p>}
                    {movieTitleInput && !isValidMovieSelected && movieTitleInput.length >= 3 && !searchLoading && movieSuggestions.length > 0 && <p className="text-sm text-yellow-400 mt-1">Select from suggestions or ensure exact match.</p>}


                    {showSuggestions && movieSuggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-gray-700 border border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                            {movieSuggestions.map((movie) => (
                                <li
                                    key={movie.imdbID}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => selectMovie(movie)}
                                    className="p-3 hover:bg-indigo-600 cursor-pointer flex items-center space-x-3"
                                >
                                    {/* <--- MODIFIED IMAGE HANDLING HERE ---> */}
                                    {movie.Poster && movie.Poster !== 'N/A' ? (
                                        <img
                                            src={movie.Poster}
                                            alt={movie.Title}
                                            className="w-10 h-10 object-cover rounded"
                                            onError={(e) => {
                                                // If image fails to load, replace with a default placeholder
                                                e.target.onerror = null; // Prevent infinite loop
                                                e.target.src = 'https://via.placeholder.com/40x60?text=No+Poster'; // Generic placeholder
                                                // Or use a local image if you add one: e.target.src = NO_POSTER_IMAGE;
                                            }}
                                        />
                                    ) : (
                                        // Placeholder for when OMDB returns 'N/A' or null
                                        <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded text-xs text-gray-300 text-center">
                                            No Poster
                                        </div>
                                    )}
                                    {/* <--- END MODIFIED IMAGE HANDLING ---> */}
                                    <div>
                                        <span className="text-white font-medium">{movie.Title}</span>
                                        <span className="text-gray-400 text-sm"> ({movie.Year})</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-300">
                        Rating (1-5 Stars)
                    </label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white"
                        required
                    >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="reviewText" className="block text-sm font-medium text-gray-300">
                        Your Review
                    </label>
                    <textarea
                        id="reviewText"
                        rows="4"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Share your thoughts on the movie..."
                        required
                    ></textarea>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}

                <button
                    type="submit"
                    disabled={isLoading || !isAuthenticated || !isValidMovieSelected}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
