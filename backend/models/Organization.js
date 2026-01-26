/**
 * Organization Model
 * Stores organization profile and global CRM settings
 */

import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    // Working hours configuration
    workingHours: {
      startTime: {
        type: String,
        default: '09:00',
      },
      endTime: {
        type: String,
        default: '18:00',
      },
      workingDays: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
    },
    // Holidays configuration
    holidays: [
      {
        date: Date,
        name: String,
      },
    ],
    // Currency and timezone settings
    currency: {
      type: String,
      default: 'USD',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    // Global CRM settings
    settings: {
      leadAutoAssignment: {
        type: Boolean,
        default: false,
      },
      dealStageNotifications: {
        type: Boolean,
        default: true,
      },
      taskReminders: {
        type: Boolean,
        default: true,
      },
    },
    // Organization contact info
    contactEmail: String,
    contactPhone: String,
    website: String,
  },
  {
    timestamps: true,
  }
);

const Organization = mongoose.model('Organization', organizationSchema);

export default Organization;
