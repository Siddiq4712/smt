// backend/controllers/reviewController.js
import {
  createReview,
  fetchReviews,
  fetchUserReviews,
  updateReview,
  deleteReview,
} from "../services/reviewService.js";

// Controller: Add review
export const addReview = async (req, res) => {
  try {
    const { movieTitle, reviewText, rating } = req.body;
    const review = await createReview(req.user.id, movieTitle, reviewText, rating);
    res.status(201).json(review);
  } catch (error) {
    // Handle specific error for duplicate review
    if (error.message.includes("You have already reviewed")) {
      return res.status(409).json({ message: error.message }); // 409 Conflict
    }
    res.status(400).json({ message: error.message });
  }
};

// Controller: Get all reviews with optional filters, sorting, and searching
export const getReviews = async (req, res) => {
  try {
    const { rating, sortBy, searchQuery } = req.query; // Extract searchQuery
    const reviews = await fetchReviews({ rating, sortBy, searchQuery }); // Pass searchQuery
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: Get reviews by a specific user (for "My Reviews" page)
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await fetchUserReviews(req.user.id);
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user's reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller: Update a review
export const editReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { movieTitle, reviewText, rating } = req.body;
    const updatedReview = await updateReview(
      id,
      req.user.id,
      movieTitle,
      reviewText,
      rating
    );
    res.json(updatedReview);
  } catch (error) {
    if (error.message.includes("Review not found") || error.message.includes("Not authorized") || error.message.includes("You have already reviewed")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Controller: Delete a review
export const removeReview = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteReview(id, req.user.id);
    res.json(result);
  } catch (error) {
    if (error.message.includes("Review not found") || error.message.includes("Not authorized")) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};
