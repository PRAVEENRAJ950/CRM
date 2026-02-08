import Rating from '../models/Rating.js';

/**
 * @desc    Submit a new rating
 * @route   POST /api/ratings
 * @access  Private (Customer only?)
 */
export const createRating = async (req, res) => {
    try {
        const { rating, feedback } = req.body;
        const userId = req.user._id;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a rating between 1 and 5',
            });
        }

        // Check if user already rated?
        // If unique index on userId exists, this will throw error or we findOneAndUpdate.
        // Let's use findOneAndUpdate to allow updating.
        const newRating = await Rating.findOneAndUpdate(
            { userId },
            { rating, feedback },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({
            success: true,
            data: newRating,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

/**
 * @desc    Get rating summary (average)
 * @route   GET /api/ratings/summary
 * @access  Private
 */
export const getRatingSummary = async (req, res) => {
    try {
        const stats = await Rating.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalRatings: { $sum: 1 },
                },
            },
        ]);

        const result = stats.length > 0 ? stats[0] : { averageRating: 0, totalRatings: 0 };

        res.status(200).json({
            success: true,
            data: {
                average: parseFloat(result.averageRating.toFixed(1)),
                count: result.totalRatings,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
