/**
 * Campaign Model
 * Manages marketing campaigns and lead sources
 */

import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Campaign name is required'],
            trim: true,
            unique: true,
        },
        type: {
            type: String,
            enum: ['Email', 'Social Media', 'Webinar', 'Event', 'Referral', 'Other'],
            default: 'Other',
        },
        status: {
            type: String,
            enum: ['Planned', 'Active', 'Completed', 'Cancelled'],
            default: 'Planned',
        },
        startDate: {
            type: Date,
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: Date,
        },
        budget: {
            type: Number,
            default: 0,
        },
        actualCost: {
            type: Number,
            default: 0,
        },
        expectedRevenue: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
            trim: true,
        },
        // Organization context
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Organization',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for ROI calculation
campaignSchema.virtual('roi').get(function () {
    if (this.actualCost === 0) return 0;
    return ((this.expectedRevenue - this.actualCost) / this.actualCost) * 100;
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
