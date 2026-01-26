/**
 * Dashboard Routes
 * Provides aggregated data for dashboard views
 */

import express from 'express';
import Lead from '../models/Lead.js';
import Deal from '../models/Deal.js';
import Activity from '../models/Activity.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireExecutive } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private - Executive+
 */
router.get('/stats', authenticate, requireExecutive, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    // Build filter based on role
    const leadFilter = {};
    const dealFilter = {};
    const activityFilter = {};

    // Sales Executives can only see their own data
    if (userRole === 'Sales Executive') {
      leadFilter.assignedTo = userId;
      dealFilter.assignedTo = userId;
      activityFilter.assignedTo = userId;
    }

    // Get lead statistics
    const totalLeads = await Lead.countDocuments(leadFilter);
    const newLeads = await Lead.countDocuments({ ...leadFilter, status: 'New' });
    const qualifiedLeads = await Lead.countDocuments({
      ...leadFilter,
      status: 'Qualified',
    });

    // Get deal statistics
    const totalDeals = await Deal.countDocuments(dealFilter);
    const totalDealValue = await Deal.aggregate([
      { $match: dealFilter },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);
    const openDeals = await Deal.countDocuments({
      ...dealFilter,
      stage: { $nin: ['Closed Won', 'Closed Lost'] },
    });
    const wonDeals = await Deal.countDocuments({
      ...dealFilter,
      stage: 'Closed Won',
    });

    // Get activity statistics
    const pendingActivities = await Activity.countDocuments({
      ...activityFilter,
      status: 'Pending',
    });
    const overdueActivities = await Activity.countDocuments({
      ...activityFilter,
      status: { $in: ['Pending', 'In Progress'] },
      dueDate: { $lt: new Date() },
    });

    // Recent activities
    const recentActivities = await Activity.find(activityFilter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Lead conversion rate
    const convertedLeads = await Lead.countDocuments({
      ...leadFilter,
      $or: [{ convertedToContact: true }, { convertedToDeal: true }],
    });
    const conversionRate =
      totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      data: {
        leads: {
          total: totalLeads,
          new: newLeads,
          qualified: qualifiedLeads,
          converted: convertedLeads,
          conversionRate: parseFloat(conversionRate),
        },
        deals: {
          total: totalDeals,
          open: openDeals,
          won: wonDeals,
          totalValue: totalDealValue[0]?.total || 0,
        },
        activities: {
          pending: pendingActivities,
          overdue: overdueActivities,
        },
        recentActivities,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/dashboard/pipeline
 * @desc    Get pipeline visualization data
 * @access  Private - Executive+
 */
router.get('/pipeline', authenticate, requireExecutive, async (req, res) => {
  try {
    const filter = {};

    // Sales Executives can only see their own deals
    if (req.user.role === 'Sales Executive') {
      filter.assignedTo = req.user._id;
    }

    const pipelineData = await Deal.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
          avgValue: { $avg: '$value' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: pipelineData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pipeline data',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/dashboard/lead-sources
 * @desc    Get lead source distribution
 * @access  Private - Executive+
 */
router.get('/lead-sources', authenticate, requireExecutive, async (req, res) => {
  try {
    const filter = {};

    // Sales Executives can only see their own leads
    if (req.user.role === 'Sales Executive') {
      filter.assignedTo = req.user._id;
    }

    const leadSources = await Lead.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: leadSources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lead sources',
      error: error.message,
    });
  }
});

export default router;
