// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // To indicate initial loading of auth state
    const navigate = useNavigate();

    // Effect to check for stored token and user on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user'); // User details (e.g., username, email)
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser)); // Parse JSON string back to object
        }
        setLoading(false); // Authentication state loaded
    }, []);

    /**
     * Handles user login.
     * @param {string} email - User's email.
     * @param {string} password - User's password.
     * @returns {Promise<void>}
     * @throws {string} - Error message if login fails.
     */
    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await loginUser(email, password);
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user)); // Store user as JSON string
            navigate('/reviews'); // Redirect to the main reviews page after successful login
        } catch (err) {
            console.error('Login failed:', err);
            throw err; // Re-throw to allow component to display the error
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles user registration.
     * @param {string} username - User's username.
     * @param {string} email - User's email.
     * @param {string} password - User's password.
     * @returns {Promise<void>}
     * @throws {string} - Error message if registration fails.
     */
    const register = async (username, email, password) => {
        setLoading(true);
        try {
            await registerUser(username, email, password);
            // After successful registration, navigate to login with a success message
            navigate('/login?registered=true');
        } catch (err) {
            console.error('Registration failed:', err);
            throw err; // Re-throw to allow component to display the error
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logs out the current user.
     */
    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login'); // Redirect to login page after logout
    };

    const isAuthenticated = !!token; // Convenience boolean for auth status

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

/**
 * Custom hook to consume the AuthContext.
 * @returns {object} - Authentication state and functions.
 * @throws {Error} - If used outside AuthProvider.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
