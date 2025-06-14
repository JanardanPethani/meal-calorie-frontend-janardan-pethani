import mongoose from "mongoose";
import { mongodbUri } from "../config/config.js";

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongodbUri, {
      // These options are no longer needed in Mongoose 6+, but kept for compatibility
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
