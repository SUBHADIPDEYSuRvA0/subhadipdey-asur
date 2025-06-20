const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: true,
        trim: true
    },
    reviewerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    complement: {
        type: String,
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
const Review = mongoose.model('Review', reviewSchema);