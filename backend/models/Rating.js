import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // One rating per customer? Or multiple? Prompt doesn't specify. Assuming allow multiple or latest.
            // "Allow customers to submit rating" implies maybe once or overwrite. 
            // Let's keep it simple: One rating per customer effectively (or we just calculate avg of all).
            // Unique true makes it one per user.
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        feedback: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
