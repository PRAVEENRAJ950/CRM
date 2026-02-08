import Organization from '../models/Organization.js';

/**
 * @desc    Get organization details
 * @route   GET /api/organization
 * @access  Private - Admin/Manager
 */
export const getOrganization = async (req, res) => {
    try {
        // Assuming single organization for now, or fetch first
        const org = await Organization.findOne();

        if (!org) {
            return res.json({ success: true, data: {} });
        }

        res.json({
            success: true,
            data: org,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch organization',
            error: error.message,
        });
    }
};

/**
 * @desc    Update organization details
 * @route   PUT /api/organization
 * @access  Private - Admin Only
 */
export const updateOrganization = async (req, res) => {
    try {
        // Upsert
        const org = await Organization.findOneAndUpdate(
            {},
            req.body,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({
            success: true,
            data: org,
            message: 'Organization settings updated',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update organization',
            error: error.message,
        });
    }
};
