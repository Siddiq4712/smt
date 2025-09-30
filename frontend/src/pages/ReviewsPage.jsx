// frontend/src/pages/ReviewsPage.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const ReviewsPage = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-[calc(100vh-64px)] bg-gray-900 flex justify-center items-center text-white text-xl">Loading...</div>;
    }

    if (!isAuthenticated) {
        // This case should ideally be handled by ProtectedRoute, but good for robustness
        return <div className="min-h-[calc(100vh-64px)] bg-gray-900 flex justify-center items-center text-white text-xl">Please log in to view reviews.</div>;
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white p-8">
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400">Movie Reviews</h1>
                <p className="text-xl text-center mb-12 text-gray-300">
                    Hello, {user?.username}! Welcome to the movie reviews section.
                </p>

                {/* Here you would integrate your ReviewForm, ReviewList, FilterSort components */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Submit a Review</h2>
                        {/* Your <ReviewForm /> component will go here */}
                        <div className="text-gray-400 italic">
                            (Placeholder for ReviewForm component)
                            <div className="mt-4 p-4 border border-gray-700 rounded-md">
                                <p>Movie Title: <input type="text" className="w-full mt-1 p-2 rounded bg-gray-700 border-gray-600 text-white" /></p>
                                <p className="mt-2">Rating: <select className="w-full mt-1 p-2 rounded bg-gray-700 border-gray-600 text-white"><option>5 Stars</option></select></p>
                                <p className="mt-2">Review: <textarea rows="3" className="w-full mt-1 p-2 rounded bg-gray-700 border-gray-600 text-white"></textarea></p>
                                <button className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white">Submit Review</button>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-indigo-400">Latest Reviews</h2>
                        {/* Your <FilterSort /> and <ReviewList /> components will go here */}
                        <div className="text-gray-400 italic">
                            (Placeholder for FilterSort and ReviewList components)
                            <div className="mt-4 p-4 border border-gray-700 rounded-md">
                                <p>Filter by: <select className="p-2 rounded bg-gray-700 border-gray-600 text-white"><option>All</option></select></p>
                                <p className="mt-2">Sort by: <select className="p-2 rounded bg-gray-700 border-gray-600 text-white"><option>Newest</option></select></p>
                                <ul className="mt-4 space-y-3">
                                    <li className="p-3 bg-gray-700 rounded">Review by User1: "Great movie!" (5 Stars)</li>
                                    <li className="p-3 bg-gray-700 rounded">Review by User2: "Could be better." (3 Stars)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewsPage;
