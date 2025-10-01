// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Review from "../models/Review.js"; // Import Review model

export const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// New middleware to check if the logged-in user owns the review
export const authorizeReviewOwner = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the review's userId matches the authenticated user's id
    if (review.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to modify this review" });
    }

    req.review = review; // Attach the review to the request for later use
    next();
  } catch (error) {
    console.error("Error authorizing review owner:", error);
    res.status(500).json({ message: "Server error during authorization" });
  }
};
