

 // Assuming you have a service to fetch About Me data

const AboutMe = require("../../models/aboutme");
const projectmodel = require("../../models/projectmodel");
const contectme = require("../../models/contectme")


class PagesController {

login= async (req, res) => {
    try{
        res.render('admin/login', { title: 'Admin Login' });
    } catch (error) {
        console.error('Error rendering login page:', error);
        res.status(500).send('Internal Server Error');
    }
}
dashboard = async (req, res) => {
    try{
        const user = req.user; // Assuming user is set by auth middleware
        res.render('admin/dashboard', { title: 'Admin Dashboard', user });
    } catch (error) {
        console.error('Error rendering dashboard page:', error);
        res.status(500).send('Internal Server Error');
    }

}
aboutme = async (req, res) => {
    try{
        const aboutData = await AboutMe.findOne(); // Fetching About Me data from the database
        // Assuming you have a service to fetch About Me data
        const user = req.user; // Assuming user is set by auth middleware
        res.render('admin/aboutme', { title: 'About Me', about: aboutData, user });
    } catch (error) {
        console.error('Error rendering about me page:', error);
        res.status(500).send('Internal Server Error');
    }
}
renderAdminProjects = async (req, res) => {
  try {
    const user = req.user
    const projects = await projectmodel.find().sort({ createdAt: -1 });
    // If editing, you might pass a project object; for add form, just pass undefined/null
    // Example: res.render('admin-projects', { projects, project: projectToEdit });
    res.render('admin/projects', { projects, project: null });
  } catch (error) {
    res.status(500).send('Error loading projects');
  }
};

// Renders edit form with selected project prefilled
renderEditProject = async (req, res) => {
  try {
    const user = req.user
    const projects = await projectmodel.find().sort({ createdAt: -1 });
    const project = await projectmodel.findById(req.params.id);
    if (!project) return res.status(404).send('Project not found');
    res.render('admin/projects', { projects, project });
  } catch (error) {
    res.status(500).send('Error loading project');
  }
};

contect= async (req, res) => {
  try{
    const contacts  = await contectme.find()
    const user = req.user
    res.render("admin/contect",{
      title:"contect",
      contacts ,
      user
    })
   }catch(err){
    res.status(500).send('errorn')

   }
}
}
module.exports = new PagesController();