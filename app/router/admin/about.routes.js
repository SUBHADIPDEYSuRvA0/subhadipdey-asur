const express = require('express');
const router = express.Router();
const aboutController = require('../../controller/admin/aboutme.controller');

const upload = require('../../multer/aboutme');


// Route to handle POST request for creating/updating About Me
router.post('/about-me', upload.single('profilePicture'), aboutController.upsertAboutMe);

module.exports = router;
