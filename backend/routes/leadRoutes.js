import express from "express";
import Lead from "../models/Lead.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/* CREATE LEAD */
router.post("/", protect, async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.json(lead);
});

/* GET LEADS */
router.get("/", protect, async (req, res) => {
  const leads = await Lead.find();
  res.json(leads);
});

export default router;
