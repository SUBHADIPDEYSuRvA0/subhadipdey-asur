const mongoose = require('mongoose');



const resumeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    pdfUrl: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    skills: [{
        type: String,
        required: true,
        trim: true
    }],
    experience: [{
        jobTitle: {
            type: String,
            required: true,
            trim: true
        },
        company: {
            type: String,
            required: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: false
        },
        description: {
            type: String,
            required: true,
            trim: true
        }
    }],
    education: [{
        degree: {
            type: String,
            required: true,
            trim: true
        },
        institution: {
            type: String,
            required: true,
            trim: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: false
        },
        description: {
            type: String,
            required: true,
            trim: true
        }
    }],
    certifications: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        issuedBy: {
            type: String,
            required: true,
            trim: true
        },
        issueDate: {
            type: Date,
            required: true
        },
        expirationDate: {
            type: Date,
            required: false
        },
        certificateUrl: {
            type: String,
            required: true,
            trim: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

const Resume = mongoose.model('Resume', resumeSchema);
