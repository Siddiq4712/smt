// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js"; // <--- NEW IMPORT

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/recommendations", recommendationRoutes); // <--- NEW ROUTE

// Default route
app.get("/", (req, res) => {
  res.send("Movie Review App API is running...");
});

// Sync models with DB (create tables if not exist, no altering)
sequelize.sync().then(() => {
  console.log("✅ All models are synced (tables created if not exist)");
}).catch(err => {
  console.error("❌ Failed to sync DB models:", err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
