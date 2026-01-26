/**
 * Lead Management Routes
 * Handles CRUD operations for leads
 */

import express from 'express';
import Lead from '../models/Lead.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireExecutive } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/leads
 * @desc    Get all leads (with filters)
 * @access  Private - Executive+
 */
router.get('/', authenticate, requireExecutive, async (req, res) => {
  try {
    const { status, assignedTo, source, search } = req.query;
    const filter = {};

    // Apply filters
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (source) filter.source = source;

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Sales Executives can only see their own leads
    if (req.user.role === 'Sales Executive') {
      filter.assignedTo = req.user._id;
    }

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/leads/:id
 * @desc    Get lead by ID
 * @access  Private - Executive+
 */
router.get('/:id', authenticate, requireExecutive, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      'assignedTo',
      'name email role'
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Check access
    if (
      req.user.role === 'Sales Executive' &&
      lead.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/leads
 * @desc    Create new lead
 * @access  Private - Executive+
 */
router.post('/', authenticate, requireExecutive, async (req, res) => {
  try {
    const { name, company, email, phone, source, status, assignedTo, notes } =
      req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and email',
      });
    }

    // Create lead
    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      source: source || 'Website',
      status: status || 'New',
      assignedTo: assignedTo || req.user._id, // Default to current user
      notes,
    });

    const populatedLead = await Lead.findById(lead._id).populate(
      'assignedTo',
      'name email role'
    );

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: populatedLead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create lead',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/leads/:id
 * @desc    Update lead
 * @access  Private - Executive+
 */
router.put('/:id', authenticate, requireExecutive, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Check access
    if (
      req.user.role === 'Sales Executive' &&
      lead.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update fields
    const { name, company, email, phone, source, status, assignedTo, notes } =
      req.body;

    if (name) lead.name = name;
    if (company !== undefined) lead.company = company;
    if (email) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (source) lead.source = source;
    if (status) lead.status = status;
    if (assignedTo) lead.assignedTo = assignedTo;
    if (notes !== undefined) lead.notes = notes;

    await lead.save();

    const populatedLead = await Lead.findById(lead._id).populate(
      'assignedTo',
      'name email role'
    );

    res.json({
      success: true,
      message: 'Lead updated successfully',
      data: populatedLead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update lead',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/leads/:id
 * @desc    Delete lead
 * @access  Private - Executive+ (Manager/Admin)
 */
router.delete('/:id', authenticate, requireExecutive, async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Only Manager/Admin can delete, or owner
    const isManager = ['System Admin', 'Sales Manager'].includes(req.user.role);
    const isOwner = lead.assignedTo?.toString() === req.user._id.toString();

    if (!isManager && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only managers or lead owner can delete.',
      });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/leads/:id/convert
 * @desc    Convert lead to contact or deal
 * @access  Private - Executive+
 */
router.post('/:id/convert', authenticate, requireExecutive, async (req, res) => {
  try {
    const { convertTo } = req.body; // 'contact' or 'deal'

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    // Mark lead as converted
    lead.convertedToContact = convertTo === 'contact';
    lead.convertedToDeal = convertTo === 'deal';
    lead.convertedDate = new Date();
    lead.status = 'Qualified';
    await lead.save();

    res.json({
      success: true,
      message: `Lead converted to ${convertTo} successfully`,
      data: lead,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to convert lead',
      error: error.message,
    });
  }
});

export default router;
