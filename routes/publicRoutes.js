const express = require('express');
const router = express.Router();
const PublicController   = require('../controllers/publicController')

router.get('/',PublicController.index)
router.get('/offres/:id',PublicController.show)
module.exports = router