// backend/routes/reviewRoutes.js
import express from 'express';
import {
  addReview,
  getReviews,
  getMyReviews, // New
  editReview,    // New
  removeReview   // New
} from '../controllers/reviewController.js';
import { protect, authorizeReviewOwner } from '../middleware/authMiddleware.js'; // Import new middleware

const router = express.Router();

// Public route for fetching all reviews (can be filtered/sorted)
router.get('/', getReviews);

// Protected routes for authenticated actions
router.post('/', protect, addReview);

// New protected route to get reviews by the logged-in user
router.get('/my-reviews', protect, getMyReviews);

// New protected routes for editing and deleting specific reviews
// Both require user to be authenticated AND to be the owner of the review
router.put('/:id', protect, authorizeReviewOwner, editReview);
router.delete('/:id', protect, authorizeReviewOwner, removeReview);

export default router;
