// frontend/src/api/authApi.js
import axios from 'axios';

// Base URL for your backend API (e.g., http://localhost:5000)
// This will be combined with '/api/auth' in the authApi instance below.
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

// Create an Axios instance for authentication specific requests
const authApi = axios.create({
    baseURL: `${BASE_URL}/api/auth`, // All auth requests will go to http://localhost:5000/api/auth/...
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Registers a new user.
 * @param {string} username - The user's username.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - The response data from the server.
 * @throws {string} - Error message if registration fails.
 */
export const registerUser = async (username, email, password) => {
    try {
        const response = await authApi.post('/register', { username, email, password });
        return response.data;
    } catch (error) {
        // Extract a more specific error message from the backend response
        throw error.response?.data?.message || 'Registration failed due to an unexpected error.';
    }
};

/**
 * Logs in an existing user.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} - The response data containing token and user info.
 * @throws {string} - Error message if login fails.
 */
export const loginUser = async (email, password) => {
    try {
        const response = await authApi.post('/login', { email, password });
        return response.data;
    } catch (error) {
        // Extract a more specific error message from the backend response
        throw error.response?.data?.message || 'Login failed due to an unexpected error.';
    }
};
