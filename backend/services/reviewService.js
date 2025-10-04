// backend/services/reviewService.js
import Review from "../models/Review.js";
import User from "../models/User.js";
import { Op } from 'sequelize';
import { getOmdbMovie } from "../utils/omdbApi.js";

// Helper function to find if a user has already reviewed a specific movie
export const findExistingReviewByUserAndMovie = async (userId, movieTitle) => {
  return await Review.findOne({
    where: {
      userId,
      movieTitle: {
        [Op.like]: movieTitle // Case-insensitive match for movie title
      }
    },
    include: { model: User, attributes: ["id", "username", "email"] }
  });
};

// Add a new review (No change needed)
export const createReview = async (userId, movieTitle, reviewText, rating) => {
  if (!movieTitle || !reviewText || !rating) {
    throw new Error("All fields are required");
  }

  // --- OMDB Validation for initial creation ---
  const omdbMovie = await getOmdbMovie(movieTitle);
  if (!omdbMovie) {
    throw new Error(`"${movieTitle}" is not a valid movie title found on OMDB. Please select a valid movie.`);
  }
  const validatedMovieTitle = omdbMovie.Title; // Use the exact title from OMDB for consistency
  // --- End OMDB Validation ---

  // Check if the user has already reviewed this movie (using the validated title)
  const existingReview = await findExistingReviewByUserAndMovie(userId, validatedMovieTitle);
  if (existingReview) {
    throw new Error(`You have already reviewed "${validatedMovieTitle}". Please edit your existing review.`);
  }

  const review = await Review.create({
    movieTitle: validatedMovieTitle, // Store the validated OMDB title
    reviewText,
    rating,
    userId,
  });

  const createdReviewWithUser = await Review.findByPk(review.id, {
    include: { model: User, attributes: ["id", "username", "email"] }
  });

  return createdReviewWithUser;
};

// Get all reviews with optional filtering, sorting, and searching (No change needed)
export const fetchReviews = async (filterOptions = {}) => {
  const { rating, sortBy, searchQuery } = filterOptions;

  let where = {};
  if (rating && rating !== 'all') {
    const parsedRating = parseInt(rating, 10);
    if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
      where.rating = parsedRating;
    }
  }

  if (searchQuery) {
    where.movieTitle = {
      [Op.like]: `%${searchQuery}%`
    };
  }

  let order = [['createdAt', 'DESC']];
  if (sortBy === 'highest_rating') {
    order = [['rating', 'DESC'], ['createdAt', 'DESC']];
  } else if (sortBy === 'lowest_rating') {
    order = [['rating', 'ASC'], ['createdAt', 'DESC']];
  }

  const reviews = await Review.findAll({
    where,
    include: { model: User, attributes: ["id", "username", "email"] },
    order,
  });
  return reviews;
};

// Fetch reviews for a specific user (No change needed)
export const fetchUserReviews = async (userId) => {
  const reviews = await Review.findAll({
    where: { userId },
    include: { model: User, attributes: ["id", "username", "email"] },
    order: [["createdAt", "DESC"]],
  });
  return reviews;
};

// Update an existing review - MODIFIED: movieTitle is no longer a parameter
export const updateReview = async (reviewId, userId, reviewText, rating) => { // <--- movieTitle removed from params
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Not authorized to update this review");
  }

  if (!reviewText || !rating) { // <--- Only validate reviewText and rating
    throw new Error("Review text and rating are required"); // Updated error message
  }

  // movieTitle is NOT updated here, it remains as per the original review.
  review.reviewText = reviewText; // Update only reviewText
  review.rating = rating;         // Update only rating
  await review.save();

  const updatedReviewWithUser = await Review.findByPk(review.id, {
    include: { model: User, attributes: ["id", "username", "email"] }
  });

  return updatedReviewWithUser;
};

// Delete a review (No change needed)
export const deleteReview = async (reviewId, userId) => {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Not authorized to delete this review");
  }

  await review.destroy();
  return { message: "Review deleted successfully" };
};
