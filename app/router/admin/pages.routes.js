const express = require('express');

const router = express.Router();
const pagesController = require('../../controller/admin/pages.controller');
const authMiddleware = require('../../middleware/auth');

router.get('/', pagesController.login);
router.get('/home',authMiddleware, pagesController.dashboard);
router.get('/about', authMiddleware, pagesController.aboutme);

router.get('/projects', authMiddleware,pagesController.renderAdminProjects);

// Render edit page for a specific project
router.get('/projects/:id/edit',authMiddleware,pagesController.renderEditProject);
router.get("/contect",authMiddleware,pagesController.contect)
module.exports = router;
