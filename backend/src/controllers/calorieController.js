import axios from "axios";
import { usdaApiKey } from "../config/config.js";
import SearchHistory from "../models/SearchHistory.js";

// @desc    Get calories for a dish
// @route   POST /get-calories
// @access  Private
export const getCalories = async (req, res) => {
  try {
    const { dish_name, servings } = req.body;

    // Validate input
    if (!dish_name || dish_name.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Dish name is required" });
    }

    if (!servings || isNaN(servings) || servings <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid number of servings is required",
      });
    }

    // Make request to USDA API
    const response = await axios.get(
      "https://api.nal.usda.gov/fdc/v1/foods/search",
      {
        params: {
          query: dish_name,
          api_key: usdaApiKey,
          pageSize: 5, // Limit to top 5 results for better matching
          dataType: "Survey (FNDDS)", // Focus on food survey data which has better coverage for dishes
        },
      }
    );

    // Check if any foods were found
    if (!response.data.foods || response.data.foods.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // Find best match using fuzzy matching (simple implementation)
    // In a production app, we'd use a more sophisticated fuzzy matching algorithm
    const bestMatch = findBestMatch(dish_name, response.data.foods);

    // Get calories per serving
    const caloriesPerServing = getCaloriesFromNutrients(
      bestMatch.foodNutrients
    );

    if (!caloriesPerServing) {
      return res.status(404).json({
        success: false,
        message: "Calorie information not available for this dish",
      });
    }

    // Calculate total calories
    const totalCalories = caloriesPerServing * servings;

    // Create meal data object
    const mealData = {
      dish_name: dish_name,
      servings: Number(servings),
      calories_per_serving: Math.round(caloriesPerServing),
      total_calories: Math.round(totalCalories),
      source: "USDA FoodData Central",
    };

    // Save to search history in database
    await saveSearchHistory(req.user._id, mealData);

    // Return result
    res.status(200).json({
      success: true,
      ...mealData,
    });
  } catch (error) {
    console.error("Error fetching calories:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching calorie data" });
  }
};

// @desc    Get user's search history
// @route   GET /search-history
// @access  Private
export const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;

    const history = await SearchHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error("Error fetching search history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching search history",
    });
  }
};

// @desc    Clear user's search history
// @route   DELETE /search-history
// @access  Private
export const clearSearchHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    await SearchHistory.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Search history cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing search history:", error);
    res.status(500).json({
      success: false,
      message: "Error clearing search history",
    });
  }
};

// @desc    Delete a single search history item
// @route   DELETE /search-history/:id
// @access  Private
export const deleteSearchHistoryItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const historyItemId = req.params.id;

    // Find the history item and ensure it belongs to the current user
    const historyItem = await SearchHistory.findOne({
      _id: historyItemId,
      userId: userId,
    });

    if (!historyItem) {
      return res.status(404).json({
        success: false,
        message: "History item not found or does not belong to you",
      });
    }

    // Delete the item
    await SearchHistory.findByIdAndDelete(historyItemId);

    res.status(200).json({
      success: true,
      message: "History item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting history item:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting history item",
    });
  }
};

// Helper function to save search history
const saveSearchHistory = async (userId, mealData) => {
  try {
    // Check if this exact search already exists to avoid duplicates
    const existingSearch = await SearchHistory.findOne({
      userId,
      dish_name: mealData.dish_name,
      servings: mealData.servings,
    });

    if (!existingSearch) {
      await SearchHistory.create({
        userId,
        ...mealData,
      });
    }
  } catch (error) {
    console.error("Error saving search history:", error);
    // Don't throw error to prevent API failure
  }
};

// Helper function to find the best match from USDA API results
const findBestMatch = (query, foods) => {
  // Normalize the search query
  const normalizedQuery = query.toLowerCase().trim();

  // Calculate similarity scores for each food
  const scoredFoods = foods.map((food) => {
    const foodName = food.description.toLowerCase();

    // Calculate Levenshtein distance (lower is better)
    const distance = levenshteinDistance(normalizedQuery, foodName);

    // Calculate exact word matches
    const queryWords = normalizedQuery.split(/\s+/);
    const foodWords = foodName.split(/\s+/);
    const wordMatchCount = queryWords.filter((word) =>
      foodWords.some((foodWord) => foodWord.includes(word))
    ).length;

    // Calculate word match ratio
    const wordMatchRatio =
      queryWords.length > 0 ? wordMatchCount / queryWords.length : 0;

    // Calculate final score (higher is better)
    // We use a combination of word match ratio and inverse distance
    const maxDistance = Math.max(normalizedQuery.length, foodName.length);
    const distanceScore = maxDistance > 0 ? 1 - distance / maxDistance : 0;

    // Combined score with higher weight on word matches
    const score = wordMatchRatio * 0.7 + distanceScore * 0.3;

    return { food, score };
  });

  // Sort by score (descending) and return the best match
  scoredFoods.sort((a, b) => b.score - a.score);
  return scoredFoods[0].food;
};

// Levenshtein distance calculation for string similarity
function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  // Create a matrix of size (m+1) x (n+1)
  const dp = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  // Initialize the matrix
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

// Helper function to extract calories from nutrients
const getCaloriesFromNutrients = (nutrients) => {
  // Find the energy/calorie nutrient
  const energyNutrient = nutrients.find(
    (nutrient) =>
      nutrient.nutrientName &&
      (nutrient.nutrientName.toLowerCase().includes("energy") ||
        nutrient.nutrientName.toLowerCase().includes("calorie"))
  );

  return energyNutrient ? energyNutrient.value : null;
};
