const Resume = require('../../models/resume');
const path = require('path');
const fs = require('fs');

const getFilePath = (folder, file) => file ? `/uploads/${folder}/${file.filename}` : null;

exports.updateOrCreateResume = async (req, res) => {
  try {
    const {
      name, email, phone, address, summary,
      skills, experience, education, certifications
    } = req.body;

    let resume = await Resume.findOne(); // Assuming only one resume (personal portfolio use-case)

    const pdfUrl = req.files?.pdf?.[0] ? getFilePath('resumes', req.files.pdf[0]) : undefined;
    const profilePicture = req.files?.profilePicture?.[0] ? getFilePath('profiles', req.files.profilePicture[0]) : undefined;

    const resumeData = {
      name,
      email,
      phone,
      address,
      summary,
      skills: Array.isArray(skills) ? skills : skills?.split(',') || [],
      experience: experience ? JSON.parse(experience) : [],
      education: education ? JSON.parse(education) : [],
      certifications: certifications ? JSON.parse(certifications) : [],
    };

    if (pdfUrl) resumeData.pdfUrl = pdfUrl;
    if (profilePicture) resumeData.profilePicture = profilePicture;

    if (resume) {
      // Clean up old files
      if (pdfUrl && resume.pdfUrl) {
        const oldPdf = path.join(__dirname, '..', 'public', resume.pdfUrl);
        if (fs.existsSync(oldPdf)) fs.unlinkSync(oldPdf);
      }
      if (profilePicture && resume.profilePicture) {
        const oldPic = path.join(__dirname, '..', 'public', resume.profilePicture);
        if (fs.existsSync(oldPic)) fs.unlinkSync(oldPic);
      }

      Object.assign(resume, resumeData);
      await resume.save();

      return res.status(200).json({ message: 'Resume updated successfully', resume });
    } else {
      resume = new Resume(resumeData);
      await resume.save();

      return res.status(201).json({ message: 'Resume created successfully', resume });
    }
  } catch (error) {
    console.error('Resume Create/Update Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
