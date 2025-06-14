import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const port = process.env.PORT || 8000;
export const mongodbUri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/calorie-count";
export const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret_key";
export const usdaApiKey = process.env.USDA_API_KEY || "";
export const nodeEnv = process.env.NODE_ENV || "development";
