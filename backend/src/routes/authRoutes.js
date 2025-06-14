import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply rate limiter to auth routes
router.use(apiLimiter);

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", protect, getUserProfile);

export default router;
