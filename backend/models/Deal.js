/**
 * Deal/Opportunity Model
 * Tracks sales opportunities through pipeline stages
 */

import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema(
  {
    dealName: {
      type: String,
      required: [true, 'Deal name is required'],
      trim: true,
    },
    stage: {
      type: String,
      enum: ['Prospecting', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
      default: 'Prospecting',
    },
    value: {
      type: Number,
      required: [true, 'Deal value is required'],
      min: [0, 'Deal value cannot be negative'],
    },
    expectedCloseDate: {
      type: Date,
      required: [true, 'Expected close date is required'],
    },
    actualCloseDate: Date,
    // Related entities
    contact: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contact',
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    // Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Deal details
    description: {
      type: String,
      trim: true,
    },
    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    // Currency
    currency: {
      type: String,
      default: 'USD',
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

// Index for pipeline queries
dealSchema.index({ stage: 1, assignedTo: 1 });
dealSchema.index({ organization: 1 });
dealSchema.index({ expectedCloseDate: 1 });

const Deal = mongoose.model('Deal', dealSchema);

export default Deal;
