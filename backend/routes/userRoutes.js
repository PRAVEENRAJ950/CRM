/**
 * User Management Routes
 * Handles CRUD operations for users
 * Only Admin can create/delete users
 */

import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin, requireManager } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin/Manager only)
 * @access  Private - Admin/Manager
 */
router.get('/', authenticate, requireManager, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private - Admin/Manager or own profile
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user can access this profile
    const isAdmin = req.user.role === 'System Admin';
    const isManager = req.user.role === 'Sales Manager';
    const isOwnProfile = req.user._id.toString() === req.params.id;

    if (!isAdmin && !isManager && !isOwnProfile) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: error.message,
    });
  }
});

/**
 * @route   POST /api/users
 * @desc    Create new user (Admin only)
 * @access  Private - Admin
 */
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, phone, company, role, status } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      company,
      role: role || 'Customer',
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message,
    });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update user (Admin can update anyone, users can update themselves)
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { name, email, phone, company, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check permissions
    const isAdmin = req.user.role === 'System Admin';
    const isOwnProfile = req.user._id.toString() === req.params.id;

    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    // Only admin can change role and status
    if (!isAdmin && (role || status)) {
      return res.status(403).json({
        success: false,
        message: 'Only admin can change role and status',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (company !== undefined) user.company = company;
    if (isAdmin && role) user.role = role;
    if (isAdmin && status) user.status = status;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
});

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private - Admin
 */
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
});

export default router;
