// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ReviewsPage from './pages/ReviewsPage';
import Header from './components/Header'; // Import your Header component

// A simple ProtectedRoute component to guard access to routes
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // You might want a full-page loading spinner here
        return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white text-xl">Loading application...</div>;
    }

    // If not authenticated, redirect to the login page
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Helper component for redirecting the root path based on auth status
const HomeRedirect = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white text-xl">Loading authentication status...</div>;
    }

    return isAuthenticated ? <Navigate to="/reviews" replace /> : <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header /> {/* Your navigation header */}
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />

                    {/* Protected route for the main reviews page */}
                    <Route
                        path="/reviews"
                        element={
                            <ProtectedRoute>
                                <ReviewsPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirect root URL based on authentication status */}
                    <Route path="/" element={<HomeRedirect />} />

                    {/* Catch-all route for 404 Not Found pages */}
                    <Route path="*" element={
                        <div className="min-h-[calc(100vh-64px)] bg-gray-900 text-white flex justify-center items-center text-2xl">
                            404 - Page Not Found
                        </div>
                    } />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
