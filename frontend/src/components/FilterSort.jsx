// frontend/src/components/FilterSort.jsx
import React from 'react';

const FilterSort = ({ filterRating, sortBy, onFilterChange, onSortChange }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
                <label htmlFor="filterRating" className="text-gray-300 text-sm font-medium whitespace-nowrap">
                    Filter by Rating:
                </label>
                <select
                    id="filterRating"
                    value={filterRating}
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white"
                >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
                <label htmlFor="sortBy" className="text-gray-300 text-sm font-medium whitespace-nowrap">
                    Sort by:
                </label>
                <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base bg-gray-700 border border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-white"
                >
                    <option value="newest">Newest First</option>
                    <option value="highest_rating">Highest Rating</option>
                    <option value="lowest_rating">Lowest Rating</option>
                </select>
            </div>
        </div>
    );
};

export default FilterSort;
