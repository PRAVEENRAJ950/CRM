// middleware/authMiddleware.js
// JWT authentication middleware to protect routes

import jwt from "jsonwebtoken"; // Import JWT to verify tokens
import User from "../models/User.js"; // Import User model to attach user info to the request

// Middleware to validate JWT and attach user to the request object
export const protect = async (req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;

    // Check if token is present and properly formatted
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Extract the token part after "Bearer "
    const token = authHeader.split(" ")[1];

    // Verify the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by ID from the token payload and exclude password
    req.user = await User.findById(decoded.id).select("-password");

    // If user not found, deny access
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware to restrict access based on user role
export const authorizeRoles = (...roles) => {
  // Return a middleware function that checks user role
  return (req, res, next) => {
    // Ensure user is attached and has a role
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have permission" });
    }
    // Proceed if role is allowed
    next();
  };
};

