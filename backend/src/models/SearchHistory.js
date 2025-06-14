const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dish_name: {
    type: String,
    required: true,
    trim: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  calories_per_serving: {
    type: Number,
    required: true,
  },
  total_calories: {
    type: Number,
    required: true,
  },
  source: {
    type: String,
    default: "USDA FoodData Central",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries by userId and createdAt
searchHistorySchema.index({ userId: 1, createdAt: -1 });

const SearchHistory = mongoose.model("SearchHistory", searchHistorySchema);

module.exports = SearchHistory;
