// frontend/src/pages/RecommendationsPage.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getRecommendations } from '../api/recommendationApi';
import { useAuth } from '../context/AuthContext';
import { searchMoviesForForm } from '../api/reviewApi'; // Reuse OMDB search for validation

const RecommendationsPage = () => {
    const { isAuthenticated } = useAuth();
    const [movieTitleInput, setMovieTitleInput] = useState('');
    const [recommendations, setRecommendations] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // OMDB Search states for movie title validation
    const [movieSuggestions, setMovieSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedMovieOmdbTitle, setSelectedMovieOmdbTitle] = useState('');
    const [isValidMovieSelected, setIsValidMovieSelected] = useState(false);
    const searchTimeoutRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Debounce OMDB search requests (copied from ReviewForm, but adjusted)
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
        setRecommendations('');
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

    const fetchRecommendations = async (e) => {
        e.preventDefault();
        setError('');
        setRecommendations('');

        if (!movieTitleInput || !isValidMovieSelected) {
            setError('Please select a valid movie title for recommendations.');
            return;
        }

        setLoading(true);
        try {
            const result = await getRecommendations(selectedMovieOmdbTitle); // Use the validated title
            setRecommendations(result);
        } catch (err) {
            console.error('Failed to fetch recommendations:', err);
            setError(err || 'Failed to get recommendations.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-[calc(100vh-64px)] bg-gray-900 flex justify-center items-center text-white text-xl">
                Please log in to get movie recommendations.
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white py-8 px-4">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400">Movie Recommendations</h1>
                <p className="text-xl text-center mb-12 text-gray-300">
                    Enter a movie title to get intelligent recommendations powered by Mistral.
                </p>

                <form onSubmit={fetchRecommendations} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
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
                            placeholder="e.g., The Matrix"
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
                                                    e.target.onerror = null; // Prevent infinite loop
                                                    e.target.src = 'https://dummyimage.com/40x60/ccc/fff&text=No+Poster'; // Updated placeholder
                                                }}
                                            />
                                        ) : (
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

                    <button
                        type="submit"
                        disabled={loading || !isValidMovieSelected}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
                    </button>
                </form>

                {error && <p className="text-red-400 text-center mt-4">{error}</p>}

                {recommendations && (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Recommendations for "{selectedMovieOmdbTitle}"</h2>
                        <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                            {recommendations}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationsPage;
