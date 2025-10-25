// backend/utils/hasher.js
import crypto from 'crypto';

/**
 * Calculates a SHA-256 hash for a given data object.
 * The data is stringified to ensure consistent hashing.
 * @param {object} data The data to hash.
 * @returns {string} The SHA-256 hash in hexadecimal format.
 */
export const calculateReviewHash = (data) => {
    // Ensure data is consistently stringified for hashing
    const dataString = JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
};
