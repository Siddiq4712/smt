// backend/models/Review.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import User from "./User.js";

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  movieTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reviewText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1, max: 5 },
  },
  // NEW: Immutable hash representing the original content + link to previous block
  originalBlockHash: {
    type: DataTypes.STRING(64), // SHA-256 hash is 64 hex characters
    allowNull: false,
    unique: true, // Each block hash should ideally be unique
  },
  // NEW: Hash of the previous block in the chain
  // Default to '0' for the very first review (genesis block concept)
  previousBlockHash: {
    type: DataTypes.STRING(64),
    allowNull: false,
    defaultValue: '0',
  },
});

// Relation: one User → many Reviews
User.hasMany(Review, { foreignKey: "userId" });
Review.belongsTo(User, { foreignKey: "userId" });

export default Review;
