// models/Activity.js
// Activity model definition for CRM application

import mongoose from "mongoose"; // Import Mongoose to define schema and model

// Define the Activity schema with basic CRM activity fields
const activitySchema = new mongoose.Schema(
  {
    // Type of activity (e.g., call, email, meeting)
    type: {
      type: String,
      required: true,
      trim: true,
    },
    // Description or notes of the activity
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // Due date for the activity
    dueDate: {
      type: Date,
      required: true,
    },
    // Current status of the activity (e.g., pending, completed)
    status: {
      type: String,
      required: true,
      trim: true,
      default: "pending",
    },
  },
  {
    // Automatically manage createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the Activity model
const Activity = mongoose.model("Activity", activitySchema);
export default Activity;

