import Campaign from '../models/Campaign.js';
import Lead from '../models/Lead.js';
import Deal from '../models/Deal.js';

/**
 * @desc    Get all campaigns
 * @route   GET /api/campaigns
 * @access  Private
 */
export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find()
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: campaigns.length,
            data: campaigns,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Get single campaign
 * @route   GET /api/campaigns/:id
 * @access  Private
 */
export const getCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Create new campaign
 * @route   POST /api/campaigns
 * @access  Private - Marketing/Admin
 */
export const createCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.create({
            ...req.body,
            createdBy: req.user._id,
        });

        res.status(201).json({ success: true, data: campaign });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
};

/**
 * @desc    Update campaign
 * @route   PUT /api/campaigns/:id
 * @access  Private - Marketing/Admin
 */
export const updateCampaign = async (req, res) => {
    try {
        let campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({ success: true, data: campaign });
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid data', error: error.message });
    }
};

/**
 * @desc    Delete campaign
 * @route   DELETE /api/campaigns/:id
 * @access  Private - Admin only
 */
export const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id);

        if (!campaign) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        await campaign.deleteOne();

        res.status(200).json({ success: true, message: 'Campaign deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

/**
 * @desc    Get campaign statistics (ROI, Leads, Deals)
 * @route   GET /api/campaigns/:id/stats
 * @access  Private
 */
export const getCampaignStats = async (req, res) => {
    try {
        const campaignId = req.params.id;

        // Count Leads linked to this campaign
        const leadCount = await Lead.countDocuments({ campaignId: campaignId });
        const convertedLeads = await Lead.countDocuments({ campaignId: campaignId, status: 'Converted' });

        // Find deals through contacts that came from this campaign

        res.status(200).json({
            success: true,
            data: {
                leads: leadCount,
                conversions: convertedLeads,
                conversionRate: leadCount > 0 ? ((convertedLeads / leadCount) * 100).toFixed(2) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};
