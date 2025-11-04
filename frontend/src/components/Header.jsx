// frontend/src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="bg-gray-800 text-white p-4 shadow-md sticky top-0 z-10">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                    Movie Reviews
                </Link>
                <div>
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-300 hidden md:inline">Welcome, {user?.username}!</span>
                            <Link to="/reviews" className="text-white hover:text-indigo-400 transition-colors">All Reviews</Link>
                            <Link to="/my-reviews" className="text-white hover:text-indigo-400 transition-colors">My Reviews</Link>
                            <Link to="/recommendations" className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white transition-colors duration-200">Recommendations</Link> {/* NEW LINK */}
                            <button
                                onClick={logout}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors duration-200">
                                Login
                            </Link>
                            <Link to="/register" className="px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-md transition-colors duration-200">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
