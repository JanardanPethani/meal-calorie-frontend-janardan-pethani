const mongoose = require("mongoose");
const { mongodbUri } = require("../config/config");

// Connect to MongoDB
const connectDB = async () => {
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

module.exports = connectDB;
