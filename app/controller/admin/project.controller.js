const Project = require('../../models/projectmodel');
const fs = require('fs');
const path = require('path');

// CREATE
exports.createProject = async (req, res) => {
  try {
    const { title, description, github, live, featured } = req.body;
    const image = req.file ? `/uploads/projects/${req.file.filename}` : null;
    if (!image) {
      return res.status(400).json({ error: 'Image is required' });
    }
    const project = new Project({
      title,
      description,
      image,
      github,
      live,
      featured
    });
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ ALL
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ONE
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Remove old image if new file uploaded
    if (req.file) {
      if (project.image) {
        const oldImagePath = path.join(__dirname, '..', project.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      project.image = `/uploads/projects/${req.file.filename}`;
    }

    // Update other fields if provided
    project.title = req.body.title ?? project.title;
    project.description = req.body.description ?? project.description;
    project.github = req.body.github ?? project.github;
    project.live = req.body.live ?? project.live;
    project.featured = req.body.featured ?? project.featured;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Delete image file
    if (project.image) {
      const imagePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
};