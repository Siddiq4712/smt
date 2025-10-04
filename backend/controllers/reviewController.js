// backend/controllers/reviewController.js
import {
  createReview,
  fetchReviews,
  fetchUserReviews,
  updateReview, // Updated updateReview service function
  deleteReview,
} from "../services/reviewService.js";
import { searchOmdbMovies } from "../utils/omdbApi.js";

// Controller: Add review (No change needed)
export const addReview = async (req, res) => {
  try {
    const { movieTitle, reviewText, rating } = req.body;
    const review = await createReview(req.user.id, movieTitle, reviewText, rating);
    res.status(201).json(review);
  } catch (error) {
    if (error.message.includes("not a valid movie title") || error.message.includes("You have already reviewed")) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: Get all reviews with optional filters, sorting, and searching (No change needed)
export const getReviews = async (req, res) => {
  try {
    const { rating, sortBy, searchQuery } = req.query;
    const reviews = await fetchReviews({ rating, sortBy, searchQuery });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: Get reviews by a specific user (for "My Reviews" page) (No change needed)
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await fetchUserReviews(req.user.id);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user's reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: Update a review - MODIFIED: movieTitle is no longer expected from req.body
export const editReview = async (req, res) => {
  try {
    const { id } = req.params; // review ID
    // ONLY destructure reviewText and rating, movieTitle should NOT be in req.body for edits
    const { reviewText, rating } = req.body; // <--- movieTitle removed from destructuring

    const updatedReview = await updateReview(
      id,
      req.user.id, // Authenticated user ID for authorization
      reviewText,  // <--- Only these fields passed to service
      rating
    );
    res.json(updatedReview);
  } catch (error) {
    if (error.message.includes("Review not found") || error.message.includes("Not authorized") || error.message.includes("Review text and rating are required")) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: Delete a review (No change needed)
export const removeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteReview(id, req.user.id);
    res.json(result);
  } catch (error) {
    if (error.message.includes("Review not found") || error.message.includes("Not authorized")) {
      return res.status(400).json({ message: error.message });
    }
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// OMDB Search controller (No change needed)
export const searchMoviesForForm = async (req, res) => {
    try {
        const { query } = req.query;
        const movies = await searchOmdbMovies(query);
        res.json(movies);
    } catch (error) {
        console.error('Error searching movies via OMDB for form:', error);
        res.status(500).json({ message: 'Error searching movies' });
    }
};
