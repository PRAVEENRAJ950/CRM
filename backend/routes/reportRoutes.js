/**
 * Reports & Analytics Routes
 * Provides various reports and analytics data
 */

import express from 'express';
import Lead from '../models/Lead.js';
import Deal from '../models/Deal.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireManager } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/reports/sales-performance
 * @desc    Get sales performance report
 * @access  Private - Manager+
 */
router.get('/sales-performance', authenticate, requireManager, async (req, res) => {
  try {
    const { startDate, endDate, userId } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (userId) {
      filter.assignedTo = userId;
    }

    // Deal performance
    const dealStats = await Deal.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$assignedTo',
          totalDeals: { $sum: 1 },
          totalValue: { $sum: '$value' },
          wonDeals: {
            $sum: { $cond: [{ $eq: ['$stage', 'Closed Won'] }, 1, 0] },
          },
          wonValue: {
            $sum: {
              $cond: [{ $eq: ['$stage', 'Closed Won'] }, '$value', 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          userName: '$user.name',
          userEmail: '$user.email',
          totalDeals: 1,
          totalValue: 1,
          wonDeals: 1,
          wonValue: 1,
          winRate: {
            $cond: [
              { $gt: ['$totalDeals', 0] },
              {
                $multiply: [
                  { $divide: ['$wonDeals', '$totalDeals'] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: dealStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate sales performance report',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/reports/lead-conversion
 * @desc    Get lead conversion report
 * @access  Private - Manager+
 */
router.get('/lead-conversion', authenticate, requireManager, async (req, res) => {
  try {
    const { startDate, endDate, source } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (source) {
      filter.source = source;
    }

    const conversionStats = await Lead.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$source',
          totalLeads: { $sum: 1 },
          newLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] },
          },
          qualifiedLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'Qualified'] }, 1, 0] },
          },
          convertedLeads: {
            $sum: {
              $cond: [
                { $or: ['$convertedToContact', '$convertedToDeal'] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          source: '$_id',
          totalLeads: 1,
          newLeads: 1,
          qualifiedLeads: 1,
          convertedLeads: 1,
          conversionRate: {
            $cond: [
              { $gt: ['$totalLeads', 0] },
              {
                $multiply: [
                  { $divide: ['$convertedLeads', '$totalLeads'] },
                  100,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { totalLeads: -1 } },
    ]);

    res.json({
      success: true,
      data: conversionStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate lead conversion report',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/reports/deal-pipeline
 * @desc    Get deal pipeline analysis
 * @access  Private - Manager+
 */
router.get('/deal-pipeline', authenticate, requireManager, async (req, res) => {
  try {
    const pipelineAnalysis = await Deal.aggregate([
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
          avgValue: { $avg: '$value' },
          minValue: { $min: '$value' },
          maxValue: { $max: '$value' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Calculate pipeline health
    const totalValue = pipelineAnalysis.reduce(
      (sum, stage) => sum + stage.totalValue,
      0
    );
    const openValue = pipelineAnalysis
      .filter(
        (stage) =>
          !['Closed Won', 'Closed Lost'].includes(stage._id)
      )
      .reduce((sum, stage) => sum + stage.totalValue, 0);

    res.json({
      success: true,
      data: {
        stages: pipelineAnalysis,
        summary: {
          totalValue,
          openValue,
          closedWonValue:
            pipelineAnalysis.find((s) => s._id === 'Closed Won')?.totalValue ||
            0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate pipeline analysis',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/reports/user-productivity
 * @desc    Get user-wise productivity report
 * @access  Private - Manager+
 */
router.get('/user-productivity', authenticate, requireManager, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get all executives
    const executives = await User.find({
      role: {
        $in: [
          'Sales Executive',
          'Marketing Executive',
          'Support Executive',
        ],
      },
    }).select('name email role');

    // Get productivity data for each user
    const productivityData = await Promise.all(
      executives.map(async (user) => {
        const leadFilter = { ...dateFilter, assignedTo: user._id };
        const dealFilter = { ...dateFilter, assignedTo: user._id };
        const activityFilter = { ...dateFilter, assignedTo: user._id };

        const [
          leadsCount,
          dealsCount,
          activitiesCount,
          completedActivities,
          wonDeals,
          totalDealValue,
        ] = await Promise.all([
          Lead.countDocuments(leadFilter),
          Deal.countDocuments(dealFilter),
          Activity.countDocuments(activityFilter),
          Activity.countDocuments({
            ...activityFilter,
            status: 'Completed',
          }),
          Deal.countDocuments({
            ...dealFilter,
            stage: 'Closed Won',
          }),
          Deal.aggregate([
            { $match: dealFilter },
            { $group: { _id: null, total: { $sum: '$value' } } },
          ]),
        ]);

        return {
          userId: user._id,
          userName: user.name,
          userEmail: user.email,
          userRole: user.role,
          leads: leadsCount,
          deals: dealsCount,
          activities: activitiesCount,
          completedActivities,
          wonDeals,
          totalDealValue: totalDealValue[0]?.total || 0,
          activityCompletionRate:
            activitiesCount > 0
              ? ((completedActivities / activitiesCount) * 100).toFixed(2)
              : 0,
        };
      })
    );

    res.json({
      success: true,
      data: productivityData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate productivity report',
      error: error.message,
    });
  }
});

export default router;
