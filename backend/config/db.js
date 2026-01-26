// config/db.js
// MongoDB connection helper using Mongoose

import mongoose from "mongoose"; // Import Mongoose for MongoDB ODM

// Function to connect to MongoDB using the URI defined in environment variables
const connectDB = async () => {
  try {
    // Attempt to connect using MONGODB_URI from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Optional connection options can be added here if needed
    });

    // Log successful connection with host information
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log connection errors and exit process with failure code
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Export the connection function as default export
export default connectDB;

