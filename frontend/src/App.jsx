// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ReviewsPage from './pages/ReviewsPage';
import ReviewHistoryPage from './pages/ReviewHistoryPage';
import RecommendationsPage from './pages/RecommendationsPage'; // <--- NEW IMPORT
import Header from './components/Header';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white text-xl">Loading application...</div>;
    }
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

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
                <Header />
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/reviews"
                        element={
                            <ProtectedRoute>
                                <ReviewsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-reviews"
                        element={
                            <ProtectedRoute>
                                <ReviewHistoryPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* <--- NEW PROTECTED ROUTE FOR RECOMMENDATIONS ---> */}
                    <Route
                        path="/recommendations"
                        element={
                            <ProtectedRoute>
                                <RecommendationsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/" element={<HomeRedirect />} />
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
