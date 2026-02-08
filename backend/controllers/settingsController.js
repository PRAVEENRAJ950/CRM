import Settings from '../models/Settings.js';

/**
 * @desc    Get global settings
 * @route   GET /api/settings
 * @access  Private - All
 */
export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json({
            success: true,
            data: settings || {},
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch settings',
        });
    }
};

/**
 * @desc    Update global settings
 * @route   PUT /api/settings
 * @access  Private - Admin
 */
export const updateSettings = async (req, res) => {
    try {
        const settings = await Settings.findOneAndUpdate(
            {},
            req.body,
            { new: true, upsert: true }
        );
        res.json({
            success: true,
            data: settings,
            message: 'Global settings updated',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
        });
    }
};
