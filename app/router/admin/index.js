const express = require('express');
const app = express.Router();

// Import routes
const authRoutes = require('./auth.routes');
const pagesRoutes = require('./pages.routes');
const aboutRoutes = require('./about.routes');
const techStackRoutes = require('./techstack.routes');
const projects =require('./project.routes')

// Use routes
app.use('/auth', authRoutes);
app.use('/', pagesRoutes);
app.use('/', aboutRoutes);
app.use('/techstack', techStackRoutes);
app.use('/',projects)
// Add more routes as needed
// Example: app.use('/users', userRoutes);

module.exports = app;
