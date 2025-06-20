const TechStack = require('../../models/techstack');
const path = require('path');
const fs = require('fs');

// Create a new tech stack
exports.createTechStack = async (req, res) => {
  try {
    const { name, description } = req.body;
    const logo = req.file ? '/uploads/logos/' + req.file.filename : null;

    const existing = await TechStack.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Tech stack already exists' });

    const tech = new TechStack({ name, description, logo });
    await tech.save();

    res.status(201).json({ message: 'Tech stack created successfully', tech });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all tech stacks
exports.getAllTechStacks = async (req, res) => {
  try {
    const stacks = await TechStack.find().sort({ createdAt: -1 });
    res.status(200).json(stacks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tech stacks' });
  }
};

// Update a tech stack
exports.updateTechStack = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const tech = await TechStack.findById(id);
    if (!tech) return res.status(404).json({ message: 'Tech stack not found' });

    tech.name = name || tech.name;
    tech.description = description || tech.description;

    if (req.file) {
      // Remove old logo file
      if (tech.logo) {
        const oldPath = path.join(__dirname, '..', 'public', tech.logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      tech.logo = '/uploads/logos/' + req.file.filename;
    }

    tech.updatedAt = Date.now();
    await tech.save();

    res.status(200).json({ message: 'Tech stack updated successfully', tech });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update tech stack' });
  }
};

// Delete a tech stack
exports.deleteTechStack = async (req, res) => {
  try {
    const { id } = req.params;

    const tech = await TechStack.findById(id);
    if (!tech) return res.status(404).json({ message: 'Tech stack not found' });

    if (tech.logo) {
      const logoPath = path.join(__dirname, '..', 'public', tech.logo);
      if (fs.existsSync(logoPath)) fs.unlinkSync(logoPath);
    }

    await TechStack.findByIdAndDelete(id);
    res.status(200).json({ message: 'Tech stack deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tech stack' });
  }
};
