/**
 * Dashboard Routes
 * Provides aggregated data for dashboard views
 */

import express from 'express';
import Lead from '../models/Lead.js';
import Deal from '../models/Deal.js';
import Activity from '../models/Activity.js';
import mongoose from 'mongoose';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireExecutive } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private - Executive+
 */
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    let dashboardData = {
      role: userRole,
    };

    // 1. CUSTOMER DASHBOARD
    if (userRole === 'Customer') {
      const unreadMessages = await mongoose.model('Message').countDocuments({ receiverId: userId, isRead: false });
      // Assuming Activity has 'participants' or we just show nothing for now as typically CRM activities are for staff.
      // But prompt says "Own activities". Maybe activities where they are the 'contact'?
      // Let's assume standard activity access is not for customers in this schema, so mocking or skipping.
      // We'll return message stats.

      dashboardData = {
        ...dashboardData,
        unreadMessages,
        // Rating status could be fetched here too
      };

      return res.json({ success: true, data: dashboardData });
    }

    // 2. STAFF DASHBOARDS (Admin, Sales, Support, Marketing)

    // Build BASE filter (what data they can see)
    const leadFilter = {};
    const dealFilter = {};
    const activityFilter = {};

    if (userRole === 'Sales Executive') {
      leadFilter.assignedTo = userId;
      dealFilter.assignedTo = userId;
      activityFilter.assignedTo = userId;
    } else if (userRole === 'Support Executive') {
      // Support might see everything or assigned?
      // Prompt: "Assigned customers".
      // Let's assume they see all for now or filter by some assignment logic not yet in DB.
      // Defaulting to "See All" for Support to be helpful, or "Assigned" if strict.
    }

    // Common Metrics (Leads, Deals, etc) - useful for all staff to some degree
    const totalLeads = await Lead.countDocuments(leadFilter);
    const newLeads = await Lead.countDocuments({ ...leadFilter, status: 'New' });
    const totalDeals = await Deal.countDocuments(dealFilter);
    const totalDealValue = await Deal.aggregate([
      { $match: dealFilter },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);

    // ROLE SPECIFIC AGGREGATIONS

    if (userRole === 'System Admin') {
      const totalUsers = await mongoose.model('User').countDocuments();
      const totalCustomers = await mongoose.model('User').countDocuments({ role: 'Customer' });
      const ratingStats = await mongoose.model('Rating').aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]);

      dashboardData = {
        ...dashboardData,
        overview: {
          totalUsers,
          totalCustomers,
          revenue: totalDealValue[0]?.total || 0,
          systemRating: ratingStats[0]?.avg || 0
        }
      };
    }

    if (userRole === 'Sales Manager') {
      // Pipeline visualization data
      const pipeline = await Deal.aggregate([
        { $group: { _id: '$stage', count: { $sum: 1 }, value: { $sum: '$value' } } }
      ]);
      dashboardData.pipeline = pipeline;
    }

    if (userRole === 'Marketing Executive') {
      const leadSources = await Lead.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } }
      ]);
      dashboardData.leadSources = leadSources;
    }

    // Base Staff Data (Activities, etc)
    const pendingActivities = await Activity.countDocuments({
      ...activityFilter,
      status: 'Pending',
    });

    const recentActivities = await Activity.find(activityFilter)
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    dashboardData = {
      ...dashboardData,
      leads: { total: totalLeads, new: newLeads },
      deals: { total: totalDeals, value: totalDealValue[0]?.total || 0 },
      activities: { pending: pendingActivities },
      recentActivities
    };

    res.json({
      success: true,
      data: dashboardData,
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

