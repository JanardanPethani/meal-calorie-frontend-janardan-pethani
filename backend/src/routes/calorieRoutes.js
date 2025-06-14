const express = require("express");
const {
  getCalories,
  getSearchHistory,
  clearSearchHistory,
} = require("../controllers/calorieController");
const { protect } = require("../middleware/auth");
const { apiLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

// Apply rate limiter to calorie routes
router.use(apiLimiter);

// Protected routes
router.post("/get-calories", protect, getCalories);
router.get("/search-history", protect, getSearchHistory);
router.delete("/search-history", protect, clearSearchHistory);

module.exports = router;
