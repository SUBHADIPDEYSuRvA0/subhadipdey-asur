
const  mongoose = require('mongoose');


const aboutMeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    bio: {
        type: String,
        required: true,
        trim: true
    },
    profilePicture: {
        type: String,
        required: true,
        trim: true
    },
    contactEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    socialLinks: {
        github: {
            type: String,
            required: true,
            trim: true
        },
        linkedin: {
            type: String,
            required: true,
            trim: true
        }
    }
});
const AboutMe = mongoose.model('AboutMe', aboutMeSchema);
module.exports = AboutMe;