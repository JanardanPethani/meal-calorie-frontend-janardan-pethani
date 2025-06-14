import express from "express";
import cors from "cors";
import { connectDB } from "./utils/db.js";
import { port, nodeEnv } from "./config/config.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import calorieRoutes from "./routes/calorieRoutes.js";

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/", calorieRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Meal Calorie Count API" });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const server = app.listen(port, () => {
  console.log(`Server running in ${nodeEnv} mode on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;
