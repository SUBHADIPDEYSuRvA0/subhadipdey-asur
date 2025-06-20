const express = require('express');
const router = express.Router();

const portfolioController = require('../../controller/ui/pages.controller');
const contectme =require("../../controller/admin/contectme")

router.get('/', portfolioController.protfoliopage);
router.post("/contectme",contectme.contactMe)

module.exports = router;