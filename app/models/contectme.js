const mongoose = require('mongoose');


const contactMeSchema = new mongoose.Schema({
    name: {
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
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
});

const ContactMe = mongoose.model('ContactMe', contactMeSchema);
module.exports = ContactMe;