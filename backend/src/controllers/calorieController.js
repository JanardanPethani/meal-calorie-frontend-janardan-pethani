import axios from "axios";
import { usdaApiKey } from "../config/config.js";
import SearchHistory from "../models/SearchHistory.js";
import Fuse from "fuse.js";

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
          pageSize: 15, // Increased to get more options for better matching
          sortBy: "dataType.keyword", // Sort by data type to prioritize higher quality data
          sortOrder: "asc", // Ascending order
        },
      }
    );

    // Check if any foods were found
    if (!response.data.foods || response.data.foods.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // Pre-process foods to ensure all have valid descriptions
    const validFoods = response.data.foods.filter(
      (food) =>
        food &&
        typeof food.description === "string" &&
        food.description.trim() !== ""
    );

    if (validFoods.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No valid food descriptions found" });
    }

    // First, check for exact matches (case-insensitive)
    const normalizedQuery = dish_name.toLowerCase().trim();
    const exactMatches = validFoods.filter(
      (food) => food.description.toLowerCase() === normalizedQuery
    );

    // If we have exact matches, use the first one
    if (exactMatches.length > 0) {
      console.log(
        `Found exact match for "${dish_name}": "${exactMatches[0].description}"`
      );
      const bestMatch = exactMatches[0];

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
        dish_name: bestMatch.description,
        servings: Number(servings),
        calories_per_serving: Math.round(caloriesPerServing),
        total_calories: Math.round(totalCalories),
        source: "USDA FoodData Central",
      };

      // Save to search history in database
      await saveSearchHistory(req.user._id, mealData);

      // Return result
      return res.status(200).json({
        success: true,
        ...mealData,
      });
    }

    // Next, check for simple matches where the query is the first word of the food name
    // This helps with cases like "strawberry" matching "Strawberry, raw" instead of "Pie, strawberry"
    if (!normalizedQuery.includes(" ")) {
      // Only for single-word queries
      const simpleMatches = validFoods.filter((food) => {
        const foodName = food.description.toLowerCase();
        return (
          foodName.startsWith(normalizedQuery + ",") ||
          foodName.startsWith(normalizedQuery + " ")
        );
      });

      if (simpleMatches.length > 0) {
        console.log(
          `Found simple match for "${dish_name}": "${simpleMatches[0].description}"`
        );
        const bestMatch = simpleMatches[0];

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
          dish_name: bestMatch.description,
          servings: Number(servings),
          calories_per_serving: Math.round(caloriesPerServing),
          total_calories: Math.round(totalCalories),
          source: "USDA FoodData Central",
        };

        // Save to search history in database
        await saveSearchHistory(req.user._id, mealData);

        // Return result
        return res.status(200).json({
          success: true,
          ...mealData,
        });
      }
    }

    // If no exact or simple match, use Fuse.js for fuzzy matching
    const options = {
      includeScore: true,
      keys: ["description"],
      threshold: 0.4, // Slightly higher threshold to allow more matches
      ignoreLocation: true, // Ignore location in string for better matching
      // Custom sorting strategy to prioritize exact matches and simple foods
      sortFn: (a, b) => {
        // Ensure both items exist and have a description property
        if (!a.item || !b.item) return 0;
        if (!a.item.description || !b.item.description) return 0;

        const itemA = a.item.description.toLowerCase();
        const itemB = b.item.description.toLowerCase();
        const query = dish_name.toLowerCase().trim();

        // Exact match gets highest priority
        if (itemA === query && itemB !== query) return -1;
        if (itemB === query && itemA !== query) return 1;

        // Starts with query gets second priority
        const aStartsWithQuery = itemA.startsWith(query);
        const bStartsWithQuery = itemB.startsWith(query);
        if (aStartsWithQuery && !bStartsWithQuery) return -1;
        if (bStartsWithQuery && !aStartsWithQuery) return 1;

        // Simple foods (no commas) get third priority
        const aIsSimple = !itemA.includes(",");
        const bIsSimple = !itemB.includes(",");
        if (aIsSimple && !bIsSimple) return -1;
        if (bIsSimple && !aIsSimple) return 1;

        // Fall back to Fuse.js score
        return a.score - b.score;
      },
    };

    const fuse = new Fuse(validFoods, options);
    const fuseResults = fuse.search(dish_name);

    if (fuseResults.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No matching foods found" });
    }

    // Log the top 3 matches for debugging
    console.log("Top matches for:", dish_name);
    fuseResults.slice(0, 3).forEach((result, i) => {
      console.log(
        `${i + 1}. ${result.item.description} (score: ${result.score.toFixed(
          2
        )})`
      );
    });

    // Get the best match
    const bestMatch = fuseResults[0].item;

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

    // Use the matched food description instead of user input
    const matchedDishName = bestMatch.description;

    // Create meal data object
    const mealData = {
      dish_name: matchedDishName,
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
