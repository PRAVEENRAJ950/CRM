// routes/authRoutes.js
// Authentication routes for register and login

import express from "express"; // Import Express router
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing
import jwt from "jsonwebtoken"; // Import JWT for token generation
import User from "../models/User.js"; // Import User model

// Create an Express router instance
const router = express.Router();

// Helper function to generate JWT token from user ID
const generateToken = (userId, role) => {
  // Create a signed JWT with user id and role
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token validity period
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  try {
    // Extract fields from request body
    const { name, company, email, phone, source, role, password } = req.body;

    // Basic validation for required fields
    if (!name || !company || !email || !phone || !source || !role || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user document
    const user = await User.create({
      name,
      company,
      email,
      phone,
      source,
      role,
      password: hashedPassword,
    });

    // Generate JWT token for the newly created user
    const token = generateToken(user._id, user.role);

    // Return user info (excluding password) and token
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        company: user.company,
        email: user.email,
        phone: user.phone,
        source: user.source,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// @route   POST /api/auth/login
// @desc    Login user and return JWT
// @access  Public
router.post("/login", async (req, res) => {
  try {
    // Extract credentials from request body
    const { email, password, role } = req.body;

    // Ensure credentials are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Optionally ensure role matches (for separate login pages)
    if (role && user.role !== role) {
      return res.status(403).json({ message: "Role mismatch for this account" });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Respond with token and user information
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        company: user.company,
        email: user.email,
        phone: user.phone,
        source: user.source,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Export the router as default export
export default router;

