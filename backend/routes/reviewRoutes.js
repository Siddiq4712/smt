// backend/routes/reviewRoutes.js
import express from 'express';
import {
  addReview,
  getReviews,
  getMyReviews,
  editReview,
  removeReview,
  searchMoviesForForm // <--- NEW IMPORT
} from '../controllers/reviewController.js';
import { protect, authorizeReviewOwner } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for fetching all reviews (can be filtered/sorted/searched)
router.get('/', getReviews);

// <--- NEW PUBLIC ROUTE FOR OMDB SEARCH (no auth needed as it's just for movie lookup) --->
router.get('/search-movies', searchMoviesForForm);

// Protected routes for authenticated actions
router.post('/', protect, addReview);

// Protected route to get reviews by the logged-in user
router.get('/my-reviews', protect, getMyReviews);

// Protected routes for editing and deleting specific reviews
router.put('/:id', protect, authorizeReviewOwner, editReview);
router.delete('/:id', protect, authorizeReviewOwner, removeReview);

export default router;
