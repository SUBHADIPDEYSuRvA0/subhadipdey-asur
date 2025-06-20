const projectmodel = require("../../models/projectmodel");



class protfolioPages{
    protfoliopage=async (req, res) => {
        try{
             const projects = await projectmodel.find().sort({ featured: -1, createdAt: -1 });
            res.render('ui/protfolio', { title: 'Protfolio' ,projects});
        }catch (error) {
            console.error('Error rendering portfolio page:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new protfolioPages();