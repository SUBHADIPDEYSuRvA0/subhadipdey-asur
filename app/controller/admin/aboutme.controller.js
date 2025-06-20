const AboutMe = require('../../models/aboutme');
const fs = require('fs');
const path = require('path');



// CREATE or UPDATE
exports.upsertAboutMe = async (req, res) => {
  try {
    const { name, bio, contactEmail, github, linkedin } = req.body;
    let profilePicture = req.file ? req.file.filename : null;

    let about = await AboutMe.findOne();

    if (!about) {
      // Create new
      about = new AboutMe({
        name,
        bio,
        contactEmail,
        profilePicture,
        socialLinks: { github, linkedin }
      });
    } else {
      // Update existing
      about.name = name;
      about.bio = bio;
      about.contactEmail = contactEmail;

      if (req.file) {
        // Delete old image
        if (about.profilePicture) {
          const oldPath = path.join(__dirname, '../uploads', about.profilePicture);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        about.profilePicture = profilePicture;
      }

      about.socialLinks.github = github;
      about.socialLinks.linkedin = linkedin;
    }

    await about.save();
    res.redirect('/about-me');
  } catch (err) {
    res.status(500).send('Server Error: ' + err.message);
  }
};
