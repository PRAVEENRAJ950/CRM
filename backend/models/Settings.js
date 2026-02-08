import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
    {
        notificationsEnabled: {
            type: Boolean,
            default: true,
        },
        autoLeadAssign: {
            type: Boolean,
            default: false,
        },
        defaultLeadStatus: {
            type: String,
            default: 'New',
        },
        reminderBeforeDeadline: {
            type: Number, // Hours
            default: 24,
        },
        theme: {
            type: String,
            default: 'light',
        },
    },
    {
        timestamps: true,
    }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
