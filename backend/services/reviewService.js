// backend/services/reviewService.js
import Review from "../models/Review.js";
import User from "../models/User.js";
import { Op } from 'sequelize'; // Import Op for LIKE operator

// Helper function to find if a user has already reviewed a specific movie
export const findExistingReviewByUserAndMovie = async (userId, movieTitle) => {
  return await Review.findOne({
    where: {
      userId,
      movieTitle: {
        [Op.like]: movieTitle // <--- CHANGED: Use Op.like for MySQL
      }
    },
    include: { model: User, attributes: ["id", "username", "email"] }
  });
};


// Add a new review
export const createReview = async (userId, movieTitle, reviewText, rating) => {
  if (!movieTitle || !reviewText || !rating) {
    throw new Error("All fields are required");
  }

  // Check if the user has already reviewed this movie
  const existingReview = await findExistingReviewByUserAndMovie(userId, movieTitle);
  if (existingReview) {
    throw new Error(`You have already reviewed "${movieTitle}". Please edit your existing review.`);
  }

  const review = await Review.create({
    movieTitle,
    reviewText,
    rating,
    userId,
  });

  const createdReviewWithUser = await Review.findByPk(review.id, {
    include: { model: User, attributes: ["id", "username", "email"] }
  });

  return createdReviewWithUser;
};

// Get all reviews with optional filtering, sorting, and searching
export const fetchReviews = async (filterOptions = {}) => {
  const { rating, sortBy, searchQuery } = filterOptions;

  let where = {};
  if (rating && rating !== 'all') {
    const parsedRating = parseInt(rating, 10);
    if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
      where.rating = parsedRating;
    }
  }

  // Add search query to the where clause
  if (searchQuery) {
    where.movieTitle = {
      [Op.like]: `%${searchQuery}%` // <--- CHANGED: Use Op.like for MySQL
    };
  }

  let order = [['createdAt', 'DESC']]; // Default sort by newest
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

// Fetch reviews for a specific user (no search/filter for history, simple newest first)
export const fetchUserReviews = async (userId) => {
  const reviews = await Review.findAll({
    where: { userId },
    include: { model: User, attributes: ["id", "username", "email"] },
    order: [["createdAt", "DESC"]],
  });
  return reviews;
};

// Update an existing review
export const updateReview = async (reviewId, userId, movieTitle, reviewText, rating) => {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("Not authorized to update this review");
  }

  if (!movieTitle || !reviewText || !rating) {
    throw new Error("All fields are required");
  }

  review.movieTitle = movieTitle;
  review.reviewText = reviewText;
  review.rating = rating;
  await review.save();

  const updatedReviewWithUser = await Review.findByPk(review.id, {
    include: { model: User, attributes: ["id", "username", "email"] }
  });

  return updatedReviewWithUser;
};

// Delete a review
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
