// server.js
// Entry point for the CRM backend server using Express and MongoDB

import express from "express"; // Import Express for building the HTTP server
import dotenv from "dotenv"; // Import dotenv to load environment variables
import cors from "cors"; // Import CORS to allow cross-origin requests from the frontend

// Import database connection helper
import connectDB from "./config/db.js";

// Import route modules
import authRoutes from "./routes/authRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Create Express application
const app = express();

// Enable CORS for all origins (for a real app, restrict this to known domains)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Enable JSON body parsing
app.use(express.json());

// Connect to MongoDB
connectDB();

// Basic health check route
app.get("/", (req, res) => {
  // Simple endpoint to confirm backend is running
  res.json({ message: "CRM backend API is running" });
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/activities", activityRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  // Log the error for debugging on the server side
  console.error("Global error handler:", err);

  // Send a generic error response
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// Define the port from environment variables or use default
const PORT = process.env.PORT || 5000;

// Start the HTTP server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

