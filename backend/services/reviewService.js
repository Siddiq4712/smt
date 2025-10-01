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
    userId,
  });

  // To return the review with user info immediately after creation
  const createdReviewWithUser = await Review.findByPk(review.id, {
    include: { model: User, attributes: ["id", "username", "email"] }
  });

  return createdReviewWithUser;
};

// Get all reviews with optional filtering and sorting
export const fetchReviews = async (filterOptions = {}) => {
  const { rating, sortBy } = filterOptions;

  let where = {};
  if (rating && rating !== 'all') {
    const parsedRating = parseInt(rating, 10);
    if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
      where.rating = parsedRating;
    }
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

// Fetch reviews for a specific user
export const fetchUserReviews = async (userId) => {
  const reviews = await Review.findAll({
    where: { userId },
    include: { model: User, attributes: ["id", "username", "email"] },
    order: [["createdAt", "DESC"]], // Always sort by newest for history
  });
  return reviews;
};

// Update an existing review
export const updateReview = async (reviewId, userId, movieTitle, reviewText, rating) => {
  const review = await Review.findByPk(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // This check is already done by authorizeReviewOwner middleware, but good for service layer robustness
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

  // Return the updated review with user info
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

  // This check is already done by authorizeReviewOwner middleware, but good for service layer robustness
  if (review.userId !== userId) {
    throw new Error("Not authorized to delete this review");
  }

  await review.destroy();
  return { message: "Review deleted successfully" };
};
