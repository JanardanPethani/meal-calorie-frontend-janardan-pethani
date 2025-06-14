const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

module.exports = {
  port: process.env.PORT || 8000,
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://localhost:27017/calorie-count",
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret_key",
  usdaApiKey: process.env.USDA_API_KEY || "",
  nodeEnv: process.env.NODE_ENV || "development",
};
