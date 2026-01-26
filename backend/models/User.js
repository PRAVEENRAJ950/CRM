// models/User.js
// User model definition for CRM application

import mongoose from "mongoose"; // Import Mongoose to define schema and model

// Define the User schema with required CRM fields
const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Company name associated with the user
    company: {
      type: String,
      required: true,
      trim: true,
    },
    // Unique email address used for login and contact
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    // Phone number for contact
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    // Lead source (e.g., website, referral, campaign)
    source: {
      type: String,
      required: true,
      trim: true,
    },
    // Role for authorization (customer, manager, admin)
    role: {
      type: String,
      enum: ["customer", "manager", "admin"],
      default: "customer",
    },
    // Hashed password for authentication
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the User model
const User = mongoose.model("User", userSchema);
export default User;

