// routes/leadRoutes.js
// CRUD routes for Leads

import express from "express"; // Import Express router
import Lead from "../models/Lead.js"; // Import Lead model
import { protect } from "../middleware/authMiddleware.js"; // Import auth middleware

// Create an Express router instance
const router = express.Router();

// @route   GET /api/leads
// @desc    Get all leads
// @access  Protected
router.get("/", protect, async (req, res) => {
  try {
    // Fetch all leads from the database
    const leads = await Lead.find().populate("assignedTo", "name email role");
    res.json(leads);
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ message: "Server error fetching leads" });
  }
});

// @route   POST /api/leads
// @desc    Create a new lead
// @access  Protected
router.post("/", protect, async (req, res) => {
  try {
    // Extract lead data from body
    const { company, source, status, assignedTo } = req.body;

    // Basic validation
    if (!company || !source || !status) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Create the lead
    const lead = await Lead.create({
      company,
      source,
      status,
      assignedTo: assignedTo || null,
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error("Create lead error:", error);
    res.status(500).json({ message: "Server error creating lead" });
  }
});

// @route   PUT /api/leads/:id
// @desc    Update a lead by ID
// @access  Protected
router.put("/:id", protect, async (req, res) => {
  try {
    // Find lead by ID and update with new data
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // If not found, return 404
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    console.error("Update lead error:", error);
    res.status(500).json({ message: "Server error updating lead" });
  }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead by ID
// @access  Protected
router.delete("/:id", protect, async (req, res) => {
  try {
    // Find lead by ID and delete
    const lead = await Lead.findByIdAndDelete(req.params.id);

    // If not found, return 404
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Delete lead error:", error);
    res.status(500).json({ message: "Server error deleting lead" });
  }
});

// Export the router as default export
export default router;

