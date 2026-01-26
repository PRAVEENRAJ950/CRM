/**
 * Deal/Opportunity Management Routes
 * Handles CRUD operations for deals
 */

import express from 'express';
import Deal from '../models/Deal.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireExecutive } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/deals
 * @desc    Get all deals (with filters)
 * @access  Private - Executive+
 */
router.get('/', authenticate, requireExecutive, async (req, res) => {
  try {
    const { stage, assignedTo, search } = req.query;
    const filter = {};

    // Apply filters
    if (stage) filter.stage = stage;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Search filter
    if (search) {
      filter.$or = [
        { dealName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sales Executives can only see their own deals
    if (req.user.role === 'Sales Executive') {
      filter.assignedTo = req.user._id;
    }

    const deals = await Deal.find(filter)
      .populate('assignedTo', 'name email role')
      .populate('contact', 'firstName lastName email')
      .populate('account', 'name industry')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: deals.length,
      data: deals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deals',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/deals/:id
 * @desc    Get deal by ID
 * @access  Private - Executive+
 */
router.get('/:id', authenticate, requireExecutive, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('contact', 'firstName lastName email phone')
      .populate('account', 'name industry');

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    // Check access
    if (
      req.user.role === 'Sales Executive' &&
      deal.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: deal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch deal',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/deals
 * @desc    Create new deal
 * @access  Private - Executive+
 */
router.post('/', authenticate, requireExecutive, async (req, res) => {
  try {
    const {
      dealName,
      stage,
      value,
      expectedCloseDate,
      contact,
      account,
      assignedTo,
      description,
      probability,
      currency,
    } = req.body;

    // Validation
    if (!dealName || !value || !expectedCloseDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide deal name, value, and expected close date',
      });
    }

    // Create deal
    const deal = await Deal.create({
      dealName,
      stage: stage || 'Prospecting',
      value,
      expectedCloseDate,
      contact,
      account,
      assignedTo: assignedTo || req.user._id,
      description,
      probability: probability || 50,
      currency: currency || 'USD',
    });

    const populatedDeal = await Deal.findById(deal._id)
      .populate('assignedTo', 'name email role')
      .populate('contact', 'firstName lastName email')
      .populate('account', 'name industry');

    res.status(201).json({
      success: true,
      message: 'Deal created successfully',
      data: populatedDeal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create deal',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/deals/:id
 * @desc    Update deal
 * @access  Private - Executive+
 */
router.put('/:id', authenticate, requireExecutive, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    // Check access
    if (
      req.user.role === 'Sales Executive' &&
      deal.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update fields
    const {
      dealName,
      stage,
      value,
      expectedCloseDate,
      actualCloseDate,
      contact,
      account,
      assignedTo,
      description,
      probability,
      currency,
    } = req.body;

    if (dealName) deal.dealName = dealName;
    if (stage) deal.stage = stage;
    if (value !== undefined) deal.value = value;
    if (expectedCloseDate) deal.expectedCloseDate = expectedCloseDate;
    if (actualCloseDate !== undefined) deal.actualCloseDate = actualCloseDate;
    if (contact !== undefined) deal.contact = contact;
    if (account !== undefined) deal.account = account;
    if (assignedTo) deal.assignedTo = assignedTo;
    if (description !== undefined) deal.description = description;
    if (probability !== undefined) deal.probability = probability;
    if (currency) deal.currency = currency;

    await deal.save();

    const populatedDeal = await Deal.findById(deal._id)
      .populate('assignedTo', 'name email role')
      .populate('contact', 'firstName lastName email')
      .populate('account', 'name industry');

    res.json({
      success: true,
      message: 'Deal updated successfully',
      data: populatedDeal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update deal',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/deals/:id
 * @desc    Delete deal
 * @access  Private - Executive+ (Manager/Admin)
 */
router.delete('/:id', authenticate, requireExecutive, async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);

    if (!deal) {
      return res.status(404).json({
        success: false,
        message: 'Deal not found',
      });
    }

    // Only Manager/Admin can delete, or owner
    const isManager = ['System Admin', 'Sales Manager'].includes(req.user.role);
    const isOwner = deal.assignedTo?.toString() === req.user._id.toString();

    if (!isManager && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only managers or deal owner can delete.',
      });
    }

    await Deal.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Deal deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete deal',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/deals/pipeline/summary
 * @desc    Get pipeline summary by stage
 * @access  Private - Executive+
 */
router.get('/pipeline/summary', authenticate, requireExecutive, async (req, res) => {
  try {
    const filter = {};

    // Sales Executives can only see their own deals
    if (req.user.role === 'Sales Executive') {
      filter.assignedTo = req.user._id;
    }

    const pipelineSummary = await Deal.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: pipelineSummary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pipeline summary',
      error: error.message,
    });
  }
});

export default router;
