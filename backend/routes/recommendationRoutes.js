// backend/routes/recommendationRoutes.js
import express from 'express';
import { recommendMovies } from '../controllers/recommendationController.js';

const router = express.Router();

// GET /api/recommendations?movieTitle=YourMovieTitle
router.get('/', recommendMovies);

export default router;
