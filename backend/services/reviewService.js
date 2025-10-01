// backend/services/reviewService.js
import Review from "../models/Review.js";
import User from "../models/User.js";

// Add a new review
export const createReview = async (userId, movieTitle, reviewText, rating) => {
  if (!movieTitle || !reviewText || !rating) {
    throw new Error("All fields are required");
  }

  const review = await Review.create({
    movieTitle,
    reviewText,
    rating,
    userId, // Ensure userId is passed for association
  });

  return review;
};

// Get all reviews with optional filtering and sorting
export const fetchReviews = async (filterOptions = {}) => {
  const { rating, sortBy } = filterOptions;
  
  let where = {};
  if (rating && rating !== 'all') {
    // Ensure rating is an integer for comparison
    const parsedRating = parseInt(rating, 10);
    if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
      where.rating = parsedRating; // Filter by specific rating
    }
  }

  let order = [['createdAt', 'DESC']]; // Default sort by newest
  if (sortBy === 'highest_rating') {
    order = [['rating', 'DESC'], ['createdAt', 'DESC']]; // Sort by rating descending, then by creation date
  } else if (sortBy === 'lowest_rating') {
    order = [['rating', 'ASC'], ['createdAt', 'DESC']]; // Sort by rating ascending, then by creation date
  }


  const reviews = await Review.findAll({
    where, // Apply filter conditions
    include: { model: User, attributes: ["id", "username", "email"] }, // <-- Corrected 'name' to 'username'
    order, // Apply sort order
  });
  return reviews;
};
