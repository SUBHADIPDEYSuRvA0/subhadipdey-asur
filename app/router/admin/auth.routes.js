const express = require('express');
const router = express.Router();
const authController = require('../../controller/admin/auth.controller');

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.get("/logout",authController.logout)

module.exports = router;
