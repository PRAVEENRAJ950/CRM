// models/Lead.js
// Lead model definition for CRM application

import mongoose from "mongoose"; // Import Mongoose to define schema and model

// Define the Lead schema with basic CRM lead fields
const leadSchema = new mongoose.Schema(
  {
    // Company related to the lead
    company: {
      type: String,
      required: true,
      trim: true,
    },
    // Lead source (e.g., website, referral)
    source: {
      type: String,
      required: true,
      trim: true,
    },
    // Current status of the lead (e.g., new, contacted, qualified)
    status: {
      type: String,
      required: true,
      trim: true,
      default: "new",
    },
    // Reference to the user (manager or owner) assigned to this lead
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the Lead model
const Lead = mongoose.model("Lead", leadSchema);
export default Lead;

