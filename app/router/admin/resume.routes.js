// routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const resumeController = require('../../controller/admin/resume');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'pdf') cb(null, '/uploads/resumes');
    else cb(null, 'public/uploads/profiles');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post(
  '/resume/update-or-create',
  upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]),
  resumeController.updateOrCreateResume
);

module.exports = router;
