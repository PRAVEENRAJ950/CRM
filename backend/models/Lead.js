/**
 * Lead Model
 * Manages potential customers and lead tracking
 */

import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Campaign', 'Social Media', 'Cold Call', 'Other'],
      default: 'Website',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'],
      default: 'New',
    },
    // Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Lead source details
    campaign: {
      type: String,
      trim: true,
    },
    // Notes and additional info
    notes: {
      type: String,
      trim: true,
    },
    // Conversion tracking
    convertedToContact: {
      type: Boolean,
      default: false,
    },
    convertedToDeal: {
      type: Boolean,
      default: false,
    },
    convertedDate: Date,
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

// Index for faster queries
leadSchema.index({ assignedTo: 1, status: 1 });
leadSchema.index({ organization: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
