/**
 * Activity Management Routes
 * Handles CRUD operations for activities (tasks, calls, meetings, etc.)
 */

import express from 'express';
import Activity from '../models/Activity.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireExecutive } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/activities
 * @desc    Get all activities (with filters)
 * @access  Private - Executive+
 */
router.get('/', authenticate, requireExecutive, async (req, res) => {
  try {
    const { type, status, assignedTo, relatedTo, priority, dueDate } = req.query;
    const filter = {};

    // Apply filters
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (relatedTo) filter.relatedTo = relatedTo;
    if (priority) filter.priority = priority;

    // Due date filter
    if (dueDate) {
      const date = new Date(dueDate);
      filter.dueDate = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    // Sales Executives can only see their own activities
    if (req.user.role === 'Sales Executive') {
      filter.assignedTo = req.user._id;
    }

    const activities = await Activity.find(filter)
      .populate('assignedTo', 'name email role')
      .sort({ dueDate: 1, createdAt: -1 });

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/activities/:id
 * @desc    Get activity by ID
 * @access  Private - Executive+
 */
router.get('/:id', authenticate, requireExecutive, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate(
      'assignedTo',
      'name email role'
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Check access
    if (
      req.user.role === 'Sales Executive' &&
      activity.assignedTo?._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/activities
 * @desc    Create new activity
 * @access  Private - Executive+
 */
router.post('/', authenticate, requireExecutive, async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      dueDate,
      status,
      assignedTo,
      relatedTo,
      relatedId,
      priority,
      reminder,
    } = req.body;

    // Validation
    if (!type || !title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide type, title, and due date',
      });
    }

    // Create activity
    const activity = await Activity.create({
      type,
      title,
      description,
      dueDate,
      status: status || 'Pending',
      assignedTo: assignedTo || req.user._id,
      relatedTo: relatedTo || 'None',
      relatedId,
      priority: priority || 'Medium',
      reminder: reminder || { enabled: false },
    });

    const populatedActivity = await Activity.findById(activity._id).populate(
      'assignedTo',
      'name email role'
    );

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: populatedActivity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create activity',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/activities/:id
 * @desc    Update activity
 * @access  Private - Executive+
 */
router.put('/:id', authenticate, requireExecutive, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Check access
    if (
      req.user.role === 'Sales Executive' &&
      activity.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Update fields
    const {
      type,
      title,
      description,
      dueDate,
      completedDate,
      status,
      assignedTo,
      relatedTo,
      relatedId,
      priority,
      reminder,
    } = req.body;

    if (type) activity.type = type;
    if (title) activity.title = title;
    if (description !== undefined) activity.description = description;
    if (dueDate) activity.dueDate = dueDate;
    if (completedDate !== undefined) activity.completedDate = completedDate;
    if (status) activity.status = status;
    if (assignedTo) activity.assignedTo = assignedTo;
    if (relatedTo) activity.relatedTo = relatedTo;
    if (relatedId !== undefined) activity.relatedId = relatedId;
    if (priority) activity.priority = priority;
    if (reminder) activity.reminder = reminder;

    await activity.save();

    const populatedActivity = await Activity.findById(activity._id).populate(
      'assignedTo',
      'name email role'
    );

    res.json({
      success: true,
      message: 'Activity updated successfully',
      data: populatedActivity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/activities/:id
 * @desc    Delete activity
 * @access  Private - Executive+
 */
router.delete('/:id', authenticate, requireExecutive, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found',
      });
    }

    // Check access
    const isManager = ['System Admin', 'Sales Manager'].includes(req.user.role);
    const isOwner = activity.assignedTo?.toString() === req.user._id.toString();

    if (!isManager && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    await Activity.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Activity deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete activity',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/activities/upcoming/reminders
 * @desc    Get upcoming activities with reminders
 * @access  Private - Executive+
 */
router.get('/upcoming/reminders', authenticate, requireExecutive, async (req, res) => {
  try {
    const filter = {
      status: { $in: ['Pending', 'In Progress'] },
      'reminder.enabled': true,
      reminderDate: { $lte: new Date() },
    };

    // Sales Executives can only see their own activities
    if (req.user.role === 'Sales Executive') {
      filter.assignedTo = req.user._id;
    }

    const activities = await Activity.find(filter)
      .populate('assignedTo', 'name email role')
      .sort({ reminderDate: 1 });

    res.json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reminders',
      error: error.message,
    });
  }
});

export default router;
