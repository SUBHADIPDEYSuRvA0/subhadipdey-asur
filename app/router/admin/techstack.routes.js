const express = require('express');
const router = express.Router();
const techController = require('../../controller/admin/techstack.controller');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/uploads/logos');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/techstack', upload.single('logo'), techController.createTechStack);
router.get('/techstack', techController.getAllTechStacks);
router.put('/techstack/:id', upload.single('logo'), techController.updateTechStack);
router.delete('/techstack/:id', techController.deleteTechStack);

module.exports = router;
