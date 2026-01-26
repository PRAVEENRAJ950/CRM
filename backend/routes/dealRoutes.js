// routes/dealRoutes.js
// CRUD routes for Deals

import express from "express"; // Import Express router
import Deal from "../models/Deal.js"; // Import Deal model
import { protect } from "../middleware/authMiddleware.js"; // Import auth middleware

// Create an Express router instance
const router = express.Router();

// @route   GET /api/deals
// @desc    Get all deals
// @access  Protected
router.get("/", protect, async (req, res) => {
  try {
    // Fetch all deals from the database
    const deals = await Deal.find();
    res.json(deals);
  } catch (error) {
    console.error("Get deals error:", error);
    res.status(500).json({ message: "Server error fetching deals" });
  }
});

// @route   POST /api/deals
// @desc    Create a new deal
// @access  Protected
router.post("/", protect, async (req, res) => {
  try {
    // Extract deal data from body
    const { dealName, stage, value } = req.body;

    // Basic validation
    if (!dealName || !stage || value === undefined) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Create the deal
    const deal = await Deal.create({
      dealName,
      stage,
      value,
    });

    res.status(201).json(deal);
  } catch (error) {
    console.error("Create deal error:", error);
    res.status(500).json({ message: "Server error creating deal" });
  }
});

// @route   PUT /api/deals/:id
// @desc    Update a deal by ID
// @access  Protected
router.put("/:id", protect, async (req, res) => {
  try {
    // Find deal by ID and update with new data
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // If not found, return 404
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.json(deal);
  } catch (error) {
    console.error("Update deal error:", error);
    res.status(500).json({ message: "Server error updating deal" });
  }
});

// @route   DELETE /api/deals/:id
// @desc    Delete a deal by ID
// @access  Protected
router.delete("/:id", protect, async (req, res) => {
  try {
    // Find deal by ID and delete
    const deal = await Deal.findByIdAndDelete(req.params.id);

    // If not found, return 404
    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    res.json({ message: "Deal deleted successfully" });
  } catch (error) {
    console.error("Delete deal error:", error);
    res.status(500).json({ message: "Server error deleting deal" });
  }
});

// Export the router as default export
export default router;

