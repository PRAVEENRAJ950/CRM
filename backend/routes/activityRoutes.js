// routes/activityRoutes.js
// CRUD routes for Activities

import express from "express"; // Import Express router
import Activity from "../models/Activity.js"; // Import Activity model
import { protect } from "../middleware/authMiddleware.js"; // Import auth middleware

// Create an Express router instance
const router = express.Router();

// @route   GET /api/activities
// @desc    Get all activities
// @access  Protected
router.get("/", protect, async (req, res) => {
  try {
    // Fetch all activities from the database
    const activities = await Activity.find();
    res.json(activities);
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({ message: "Server error fetching activities" });
  }
});

// @route   POST /api/activities
// @desc    Create a new activity
// @access  Protected
router.post("/", protect, async (req, res) => {
  try {
    // Extract activity data from body
    const { type, description, dueDate, status } = req.body;

    // Basic validation
    if (!type || !description || !dueDate || !status) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Create the activity
    const activity = await Activity.create({
      type,
      description,
      dueDate,
      status,
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error("Create activity error:", error);
    res.status(500).json({ message: "Server error creating activity" });
  }
});

// @route   PUT /api/activities/:id
// @desc    Update an activity by ID
// @access  Protected
router.put("/:id", protect, async (req, res) => {
  try {
    // Find activity by ID and update with new data
    const activity = await Activity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // If not found, return 404
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json(activity);
  } catch (error) {
    console.error("Update activity error:", error);
    res.status(500).json({ message: "Server error updating activity" });
  }
});

// @route   DELETE /api/activities/:id
// @desc    Delete an activity by ID
// @access  Protected
router.delete("/:id", protect, async (req, res) => {
  try {
    // Find activity by ID and delete
    const activity = await Activity.findByIdAndDelete(req.params.id);

    // If not found, return 404
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Delete activity error:", error);
    res.status(500).json({ message: "Server error deleting activity" });
  }
});

// Export the router as default export
export default router;

