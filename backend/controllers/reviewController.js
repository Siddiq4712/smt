// backend/controllers/reviewController.js
import { createReview, fetchReviews } from "../services/reviewService.js";

// Controller: Add review
export const addReview = async (req, res) => {
  try {
    const { movieTitle, reviewText, rating } = req.body;
    // req.user.id is populated by the protect middleware after JWT verification
    const review = await createReview(req.user.id, movieTitle, reviewText, rating);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controller: Get reviews
export const getReviews = async (req, res) => {
  try {
    const { rating, sortBy } = req.query; // Extract filter and sort parameters from query
    const reviews = await fetchReviews({ rating, sortBy });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
