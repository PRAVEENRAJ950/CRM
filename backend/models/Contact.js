/**
 * Contact Model
 * Manages customer contacts under accounts
 */

import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
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
    // Account relationship
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    // Job details
    jobTitle: {
      type: String,
      trim: true,
    },
    department: {
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
    // Communication preferences
    preferredContactMethod: {
      type: String,
      enum: ['Email', 'Phone', 'SMS', 'Other'],
      default: 'Email',
    },
    // Notes
    notes: {
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

contactSchema.index({ account: 1 });
contactSchema.index({ organization: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
