import express from "express";
import {
  getCalories,
  getSearchHistory,
  clearSearchHistory,
  deleteSearchHistoryItem,
} from "../controllers/calorieController.js";
import { protect } from "../middleware/auth.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply rate limiter to calorie routes
router.use(apiLimiter);

// Protected routes
router.post("/get-calories", protect, getCalories);
router.get("/search-history", protect, getSearchHistory);
router.delete("/search-history", protect, clearSearchHistory);
router.delete("/search-history/:id", protect, deleteSearchHistoryItem);

export default router;
