/**
 * Activity Model
 * Manages tasks, calls, meetings, and follow-ups
 */

import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Call', 'Meeting', 'Email', 'Task', 'Follow-up', 'Note'],
      required: [true, 'Activity type is required'],
    },
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    completedDate: Date,
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    // Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Related entities
    relatedTo: {
      type: String,
      enum: ['Lead', 'Deal', 'Contact', 'Account', 'None'],
      default: 'None',
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // Priority
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    // Reminder settings
    reminder: {
      enabled: {
        type: Boolean,
        default: false,
      },
      reminderDate: Date,
    },
    // Organization context
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
activitySchema.index({ assignedTo: 1, status: 1, dueDate: 1 });
activitySchema.index({ organization: 1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
