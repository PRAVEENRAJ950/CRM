/**
 * Account Model
 * Represents customer organizations/companies
 */

import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    // Account type
    type: {
      type: String,
      enum: ['Customer', 'Partner', 'Competitor', 'Reseller', 'Other'],
      default: 'Customer',
    },
    // Contact information
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    // Address
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    // Account details
    annualRevenue: Number,
    numberOfEmployees: Number,
    // Account owner/manager
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Status
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active',
    },
    // Notes
    description: {
      type: String,
      trim: true,
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

accountSchema.index({ assignedTo: 1 });
accountSchema.index({ organization: 1 });

const Account = mongoose.model('Account', accountSchema);

export default Account;
