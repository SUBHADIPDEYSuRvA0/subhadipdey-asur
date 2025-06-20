const express = require('express');
const router = express.Router();
const projectController = require('../../controller/admin/project.controller');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/projects/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// CREATE
router.post('/projects', upload.single('image'), projectController.createProject);
// READ ALL
router.get('/projects', projectController.getAllProjects);
// READ ONE
router.get('/projects/:id', projectController.getProjectById);
// UPDATE
router.post('/projects/:id', upload.single('image'), projectController.updateProject);
// DELETE
router.post('/projects/delete/:id', projectController.deleteProject);

module.exports = router;