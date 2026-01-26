// models/Deal.js
// Deal model definition for CRM application

import mongoose from "mongoose"; // Import Mongoose to define schema and model

// Define the Deal schema with basic CRM deal fields
const dealSchema = new mongoose.Schema(
  {
    // Name or title of the deal
    dealName: {
      type: String,
      required: true,
      trim: true,
    },
    // Current stage of the deal (e.g., prospecting, negotiation, closed-won)
    stage: {
      type: String,
      required: true,
      trim: true,
    },
    // Monetary value of the deal
    value: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the Deal model
const Deal = mongoose.model("Deal", dealSchema);
export default Deal;

